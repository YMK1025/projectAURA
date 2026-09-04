import {
  calcPlayerAtk, calcEnemyAtk, calcPlayerDef, calcDamage,
  calcSkillDamage, calcHeal, rollDodge,
  tickEffects, randInt
} from './stats.js';
import { SKILLS, getSkillAtLevel } from '../data/skills.js';
import { ENEMIES } from '../data/enemies.js';

/* ────────────────────────────────────────────
   전투 초기화
   ──────────────────────────────────────────── */
export function initCombat(enemies, enemyMult = 1.0) {
  const scaledEnemies = enemies.map(id => {
    const e = ENEMIES[id];
    const scaledHp = Math.round((e.maxHp ?? 100) * enemyMult);
    const scaledAtk = Math.round((e.atk ?? 20) * enemyMult);
    return {
      ...e,
      maxHp: scaledHp,
      atk: scaledAtk,
      currentHp: scaledHp,
      staggerCurrent: 0,
      effects: [],
      phases: (e.phases ?? []).map(p => ({ ...p, triggered: false })),
    };
  });
  const nextEnemyActions = {};
  scaledEnemies.forEach(e => {
    nextEnemyActions[e.id] = pickAction(e.pattern);
  });
  return {
    enemies: scaledEnemies,
    playerEffects: [],
    log: [],
    round: 1,
    phase: 'player',
    nextEnemyActions,
  };
}

/* ────────────────────────────────────────────
   플레이어: 일반 공격
   ──────────────────────────────────────────── */
export function playerAttack(combat, playerStats, equipment, job) {
  const target = getFirstAliveEnemy(combat.enemies);
  if (!target) return { ...combat, phase: 'win' };

  const atk = calcPlayerAtk(playerStats, combat.playerEffects);
  const tDef = target.def;
  let dmg = calcDamage(atk, tDef);

  // 뇌격사 패시브: 일반 공격력 +15%
  if (job === 'storm_caller') dmg = Math.floor(dmg * 1.15);

  // 스태거된 적에게 2배 피해
  if (target.effects?.find(ef => ef.type === 'staggered')) dmg = Math.round(dmg * 2);

  // 속성 약점/반감 (일반 공격 = physical)
  const attackElement = 'physical';
  const log = [];
  if (target.weakTo === attackElement) {
    dmg = Math.round(dmg * 1.5);
    log.push(`⚡ 약점! ${target.name}에게 **${dmg}** 피해.`);
  } else if (target.resistTo === attackElement) {
    dmg = Math.round(dmg * 0.75);
    log.push(`🛡 반감. ${target.name}에게 **${dmg}** 피해.`);
  } else {
    log.push(`⚔️ 공격! ${target.name}에게 **${dmg}** 피해.`);
  }

  let newEnemies = dealDamageToEnemy(combat.enemies, target.id, dmg, log);

  // 스태거 빌드
  newEnemies = applyStagger(newEnemies, target.id, 15, log);

  // 화염술사 패시브: 10% 확률 화상 부여
  if (job === 'pyromancer' && Math.random() < 0.1) {
    const alive = newEnemies.find(e => e.id === target.id && e.currentHp > 0);
    if (alive) {
      newEnemies = applyEffectToEnemy(newEnemies, target.id,
        { type: 'burn', damage: 20, duration: 2 }, job);
      log.push(`🔥 화염 패시브! ${target.name}에게 화상 발생.`);
    }
  }

  newEnemies = checkBossPhases(newEnemies, log);
  const phase = newEnemies.every(e => e.currentHp <= 0) ? 'win' : 'enemy';
  return {
    ...combat,
    enemies: newEnemies,
    log: [...combat.log, ...log],
    phase,
    playerEffects: tickEffects(combat.playerEffects),
  };
}

/* ────────────────────────────────────────────
   플레이어: 스킬 사용
   ──────────────────────────────────────────── */
export function playerSkill(combat, skillId, playerStats, equipment, job, skillLevels = {}) {
  const skillBase = SKILLS[skillId];
  if (!skillBase) return { error: '알 수 없는 스킬' };
  const skill = getSkillAtLevel(skillBase, skillLevels[skillId] ?? 1);

  const log = [];
  let newEnemies = [...combat.enemies];
  let newPlayerEffects = [...combat.playerEffects];
  let hpDelta = 0;
  let extraTurn = false;

  const target = getFirstAliveEnemy(newEnemies);
  const skillElement = SKILLS[skillId]?.element ?? 'physical';

  if (skill.type === 'damage') {
    const tEffects = target?.effects ?? [];
    let dmg = calcSkillDamage(skill, playerStats, tEffects);

    if (skill.target === 'all_enemies') {
      // 전체 공격 — 속성 체크는 개별 적마다, 스태거 처리도 개별
      if (skill.hits && skill.hits > 1) {
        newEnemies = newEnemies.map(e => {
          if (e.currentHp <= 0) return e;
          let perHitDmg = dmg;
          if (e.effects?.find(ef => ef.type === 'staggered')) perHitDmg = Math.round(perHitDmg * 2);
          const finalDmg = applyElementMod(perHitDmg, skillElement, e, log);
          const totalDmg = finalDmg * skill.hits;
          return { ...e, currentHp: Math.max(0, e.currentHp - totalDmg) };
        });
        log.push(`⚡ ${skill.name}! 모든 적에게 ${skill.hits}히트!`);
        // 스태거: all_enemies multi-hit — 12 per enemy (split logic ~25 total)
        newEnemies.filter(e => e.currentHp > 0).forEach(e => {
          newEnemies = applyStagger(newEnemies, e.id, 12, log);
        });
      } else {
        newEnemies = newEnemies.map(e => {
          if (e.currentHp <= 0) return e;
          let d = dmg;
          if (e.effects?.find(ef => ef.type === 'staggered')) d = Math.round(d * 2);
          const finalDmg = applyElementMod(d, skillElement, e, log);
          return { ...e, currentHp: Math.max(0, e.currentHp - finalDmg) };
        });
        log.push(`💥 ${skill.name}! 모든 적에게 공격!`);
        // 스태거: all_enemies single hit — 12 per enemy
        newEnemies.filter(e => e.currentHp > 0).forEach(e => {
          newEnemies = applyStagger(newEnemies, e.id, 12, log);
        });
      }
      newEnemies.forEach(e => {
        const wasAlive = combat.enemies.find(ce => ce.id === e.id)?.currentHp > 0;
        if (wasAlive && e.currentHp <= 0) log.push(`💀 ${e.name} 쓰러짐!`);
      });
      if (skill.burnEffect) {
        newEnemies = newEnemies.map(e => {
          if (e.currentHp <= 0) return e;
          return {
            ...e,
            effects: [...(e.effects ?? []), {
              type: 'burn', damage: skill.burnEffect.damage,
              duration: skill.burnEffect.duration,
              id: 'burn_' + e.id + '_' + Date.now(),
            }],
          };
        });
        log.push(`🔥 화상 전파!`);
      }
      if (skill.poisonEffect) {
        newEnemies.forEach(e => {
          if (e.currentHp > 0) {
            newEnemies = applyEffectToEnemy(newEnemies, e.id,
              { type: 'poison', damage: skill.poisonEffect.damage, stackDamage: skill.poisonEffect.stackDamage ?? 0, duration: skill.poisonEffect.duration }, job);
          }
        });
        log.push(`🟢 독 전파!`);
      }
      if (skill.bleedEffect) {
        newEnemies.forEach(e => {
          if (e.currentHp > 0) {
            newEnemies = applyEffectToEnemy(newEnemies, e.id,
              { type: 'bleed', damage: skill.bleedEffect.damage, duration: skill.bleedEffect.duration }, job);
          }
        });
        log.push(`🔴 출혈 전파!`);
      }
    } else if (target) {
      // 단일 대상
      if (target.effects?.find(ef => ef.type === 'staggered')) dmg = Math.round(dmg * 2);
      const finalDmg = applyElementMod(dmg, skillElement, target, log);
      if (!log.some(l => l.includes(target.name) && l.includes('피해'))) {
        log.push(`✨ ${skill.name}! ${target.name}에게 **${finalDmg}** 피해.`);
      }
      newEnemies = dealDamageToEnemy(newEnemies, target.id, finalDmg, log);

      // 스태거 — 단일 공격
      const staggerAmt = skill.hits && skill.hits > 1 ? 25 : 20;
      newEnemies = applyStagger(newEnemies, target.id, staggerAmt, log);

      if (skill.lifesteal) {
        const heal = Math.floor(finalDmg * skill.lifesteal);
        hpDelta += heal;
        log.push(`🩸 흡혈: HP **+${heal}** 회복.`);
      }
      if (skill.burnEffect) {
        const stillAlive = newEnemies.find(e => e.id === target.id && e.currentHp > 0);
        if (stillAlive) {
          newEnemies = applyEffectToEnemy(newEnemies, target.id,
            { type: 'burn', damage: skill.burnEffect.damage, duration: skill.burnEffect.duration }, job);
          log.push(`🔥 ${target.name}에게 화상!`);
        }
      }
      if (skill.poisonEffect) {
        const stillAlive = newEnemies.find(e => e.id === target.id && e.currentHp > 0);
        if (stillAlive) {
          newEnemies = applyEffectToEnemy(newEnemies, target.id,
            { type: 'poison', damage: skill.poisonEffect.damage, stackDamage: skill.poisonEffect.stackDamage ?? 0, duration: skill.poisonEffect.duration }, job);
          log.push(`🟢 ${target.name}에게 독!`);
        }
      }
      if (skill.bleedEffect) {
        const stillAlive = newEnemies.find(e => e.id === target.id && e.currentHp > 0);
        if (stillAlive) {
          newEnemies = applyEffectToEnemy(newEnemies, target.id,
            { type: 'bleed', damage: skill.bleedEffect.damage, duration: skill.bleedEffect.duration }, job);
          log.push(`🔴 ${target.name}에게 출혈!`);
        }
      }
    }

  } else if (skill.type === 'heal') {
    const heal = calcHeal(skill, playerStats);
    hpDelta = heal;
    log.push(`💚 ${skill.name}! HP **+${heal}** 회복.`);

  } else if (skill.type === 'buff') {
    newPlayerEffects.push({ ...skill.effect, id: skillId + '_' + Date.now() });
    log.push(`🛡️ ${skill.name}! ${getEffectDesc(skill.effect)} 효과.`);
    if (skill.comboEffect) {
      newPlayerEffects.push({ ...skill.comboEffect, id: skillId + '_cb_' + Date.now() });
      log.push(`✨ 추가 효과: ${getEffectDesc(skill.comboEffect)}!`);
    }
    if (skill.healAmount) {
      hpDelta += skill.healAmount;
      log.push(`💚 HP **+${skill.healAmount}** 회복.`);
    }
    if (skill.secondEffect && target) {
      newEnemies = applyEffectToEnemy(newEnemies, target.id, skill.secondEffect, job);
      log.push(`🔍 ${target.name}에게 ${getEffectDesc(skill.secondEffect)} 효과!`);
    }
    if (skill.extraTurn) {
      extraTurn = true;
      log.push(`⏩ 추가 행동 획득!`);
    }

  } else if (skill.type === 'debuff' && target) {
    newEnemies = applyEffectToEnemy(newEnemies, target.id, skill.effect, job);
    log.push(`🌀 ${skill.name}! ${target.name}에게 ${getEffectDesc(skill.effect)}.`);
    newEnemies = applyStagger(newEnemies, target.id, 10, log);

  } else if (skill.type === 'special') {
    if (skill.dominateMult !== undefined && target) {
      const selfDmg = Math.floor(target.atk * skill.dominateMult);
      newEnemies = dealDamageToEnemy(newEnemies, target.id, selfDmg, log);
      log.push(`🧠 ${skill.name}! ${target.name}이(가) 자신을 공격! **${selfDmg}** 피해.`);
      newEnemies = applyStagger(newEnemies, target.id, 15, log);
      if (skill.followEffect) {
        newEnemies = applyEffectToEnemy(newEnemies, target.id, skill.followEffect, job);
        log.push(`🌀 ${target.name}에게 ${getEffectDesc(skill.followEffect)} 효과!`);
      }
    } else if (skill.effect?.type === 'extra_turn') {
      extraTurn = true;
      log.push(`🌊 ${skill.name}! 추가 행동 획득!`);
    }
  }

  newEnemies = checkBossPhases(newEnemies, log);
  const win = newEnemies.every(e => e.currentHp <= 0);
  return {
    newCombat: {
      ...combat,
      enemies: newEnemies,
      log: [...combat.log, ...log],
      phase: win ? 'win' : extraTurn ? 'player' : 'enemy',
      playerEffects: tickEffects(newPlayerEffects),
    },
    hpDelta,
  };
}

/* ────────────────────────────────────────────
   플레이어: 방어
   ──────────────────────────────────────────── */
export function playerDefend(combat) {
  const effect = { type: 'defended', duration: 1, mult: 0.5, id: 'defend_' + Date.now() };
  const log = ['🛡️ 방어 태세! 이번 턴 피해 50% 감소.'];
  return {
    ...combat,
    playerEffects: [...combat.playerEffects, effect],
    log: [...combat.log, ...log],
    phase: 'enemy',
  };
}

/* ────────────────────────────────────────────
   아이템 사용
   ──────────────────────────────────────────── */
export function useItemInCombat(combat, item, currentHp, maxHp, currentMp, maxMp) {
  let hpDelta = 0, mpDelta = 0;
  const log = [];
  if (item.effect.hp) {
    hpDelta = Math.min(item.effect.hp, maxHp - currentHp);
    log.push(`🧪 ${item.name} 사용! HP **+${hpDelta}** 회복.`);
  }
  if (item.effect.mp) {
    mpDelta = Math.min(item.effect.mp, maxMp - currentMp);
    log.push(`💊 ${item.name} 사용! MP **+${mpDelta}** 회복.`);
  }
  if (item.effect.cleanse) {
    log.push(`🫙 ${item.name} 사용! 상태이상 해제.`);
  }
  return {
    newCombat: {
      ...combat,
      log: [...combat.log, ...log],
      phase: 'enemy',
      playerEffects: item.effect.cleanse ? [] : combat.playerEffects,
    },
    hpDelta, mpDelta,
  };
}

/* ────────────────────────────────────────────
   적 턴 처리
   ──────────────────────────────────────────── */
export function enemyTurn(combat, playerStats, equipment, job, currentHp) {
  let log = [];
  let hpDelta = 0;
  let newPlayerEffects = [...combat.playerEffects];
  let newEnemies = [...combat.enemies];

  for (let i = 0; i < newEnemies.length; i++) {
    const e = newEnemies[i];
    if (e.currentHp <= 0) continue;

    // 화상 도트 피해
    const burn = newEnemies[i].effects?.find(ef => ef.type === 'burn');
    if (burn) {
      const burnDmg = burn.damage;
      newEnemies[i] = { ...newEnemies[i], currentHp: Math.max(0, newEnemies[i].currentHp - burnDmg) };
      log.push(`🔥 ${e.name} 화상 **${burnDmg}** 피해!`);
      if (newEnemies[i].currentHp <= 0) {
        log.push(`💀 ${e.name} 쓰러짐!`);
        newEnemies[i] = { ...newEnemies[i], effects: tickEffects(newEnemies[i].effects ?? []) };
        continue;
      }
    }

    // 독 도트 피해 (매 턴 damage 누적 증가)
    const poison = newEnemies[i].effects?.find(ef => ef.type === 'poison');
    if (poison) {
      const poisonDmg = poison.damage;
      newEnemies[i] = { ...newEnemies[i], currentHp: Math.max(0, newEnemies[i].currentHp - poisonDmg) };
      log.push(`🟢 ${e.name} 독 **${poisonDmg}** 피해!`);
      newEnemies[i] = {
        ...newEnemies[i],
        effects: newEnemies[i].effects.map(ef =>
          ef.id === poison.id ? { ...ef, damage: ef.damage + (ef.stackDamage ?? 0) } : ef
        ),
      };
      if (newEnemies[i].currentHp <= 0) {
        log.push(`💀 ${e.name} 쓰러짐!`);
        newEnemies[i] = { ...newEnemies[i], effects: tickEffects(newEnemies[i].effects ?? []) };
        continue;
      }
    }

    // 스턴
    const stun = newEnemies[i].effects?.find(ef => ef.type === 'stun');
    if (stun) {
      log.push(`😵 ${e.name} 행동 불능!`);
      newEnemies[i] = { ...newEnemies[i], effects: tickEffects(newEnemies[i].effects) };
      continue;
    }

    // 스태거
    const staggered = newEnemies[i].effects?.find(ef => ef.type === 'staggered');
    if (staggered) {
      log.push(`💥 ${e.name} 스태거! 행동 불능.`);
      newEnemies[i] = { ...newEnemies[i], effects: tickEffects(newEnemies[i].effects) };
      continue;
    }

    const action = pickAction(e.pattern);

    if (action.hint) {
      log.push(`💭 ${e.name}: "${action.hint}"`);
    }

    if (action.action === 'attack') {
      const atkVal = calcEnemyAtk(newEnemies[i], newEnemies[i].effects);
      if (rollDodge(job, newPlayerEffects)) {
        log.push(`💨 ${e.name}의 공격 — 회피!`);
        newPlayerEffects = newPlayerEffects.filter(ef => ef.type !== 'dodge_next');
        if (job === 'beast_shifter') {
          hpDelta += 20;
          log.push(`🐺 야수의 본능: HP +20.`);
        }
      } else {
        const def = calcPlayerDef(playerStats, equipment, newPlayerEffects);
        let dmg = calcDamage(atkVal, def);
        if (job === 'guardian') dmg = Math.max(1, Math.floor(dmg * 0.9));
        hpDelta -= dmg;
        log.push(`🗡️ ${e.name}의 공격! **${dmg}** 피해.`);
        newPlayerEffects = newPlayerEffects.filter(ef => ef.type !== 'dodge_next');
      }
    } else if (action.action === 'skill') {
      const rawDmg = Math.floor((newEnemies[i].atk) * (action.skillDmgMult ?? 1));
      if ((action.skillDmgMult ?? 0) > 0) {
        if (rollDodge(job, newPlayerEffects)) {
          log.push(`💨 ${e.name}의 **${action.skillName}** — 회피!`);
          newPlayerEffects = newPlayerEffects.filter(ef => ef.type !== 'dodge_next');
          if (job === 'beast_shifter') { hpDelta += 20; log.push(`🐺 HP +20.`); }
        } else {
          const def = calcPlayerDef(playerStats, equipment, newPlayerEffects);
          let dmg = action.hits
            ? Array.from({ length: action.hits }, () =>
                calcDamage(Math.floor(rawDmg / action.hits), def)
              ).reduce((a, b) => a + b, 0)
            : calcDamage(rawDmg, def);
          if (job === 'guardian') dmg = Math.max(1, Math.floor(dmg * 0.9));
          hpDelta -= dmg;
          log.push(`⚡ ${e.name}의 **${action.skillName}**! **${dmg}** 피해.`);
        }
      }
      if (action.debuff) {
        const debuffEffect = makeDebuffEffect(action.debuff);
        newPlayerEffects.push(debuffEffect);
        log.push(`😨 ${e.name}의 ${getEffectDesc(debuffEffect)} 효과!`);
      }
    } else if (action.action === 'defend') {
      newEnemies[i] = { ...newEnemies[i], effects: [...(newEnemies[i].effects ?? []), { type: 'defended', duration: 1 }] };
      log.push(`🛡️ ${e.name} 방어 태세.`);
    } else if (action.action === 'berserk') {
      const def = calcPlayerDef(playerStats, equipment, newPlayerEffects);
      let finalDmg = calcDamage(Math.floor(newEnemies[i].atk * 2), def);
      if (job === 'guardian') finalDmg = Math.max(1, Math.floor(finalDmg * 0.9));
      hpDelta -= finalDmg;
      log.push(`💢 ${e.name} **광폭화**! **${finalDmg}** 피해!`);
    }

    // 출혈: 공격 행동 시 자해
    if (action.action === 'attack' || action.action === 'berserk' ||
        (action.action === 'skill' && (action.skillDmgMult ?? 0) > 0)) {
      const bleed = newEnemies[i].effects?.find(ef => ef.type === 'bleed');
      if (bleed && newEnemies[i].currentHp > 0) {
        newEnemies[i] = { ...newEnemies[i], currentHp: Math.max(0, newEnemies[i].currentHp - bleed.damage) };
        log.push(`🔴 ${e.name} 출혈! 자해 **${bleed.damage}** 피해.`);
        if (newEnemies[i].currentHp <= 0) log.push(`💀 ${e.name} 쓰러짐!`);
      }
    }

    newEnemies[i] = { ...newEnemies[i], effects: tickEffects(newEnemies[i].effects ?? []) };
  }

  newPlayerEffects = tickEffects(newPlayerEffects);
  const newHp = currentHp + hpDelta;
  const phase = newHp <= 0 ? 'lose' : 'player';

  // 다음 플레이어 턴을 위해 생존 적의 다음 행동 미리 선택
  const nextEnemyActions = {};
  newEnemies.forEach(e => {
    if (e.currentHp > 0) nextEnemyActions[e.id] = pickAction(e.pattern);
  });

  return {
    newCombat: {
      ...combat,
      enemies: newEnemies,
      log: [...combat.log, ...log],
      phase,
      playerEffects: newPlayerEffects,
      round: combat.round + 1,
      nextEnemyActions,
    },
    hpDelta,
  };
}

/* ── 내부 헬퍼 ─────────────────────────────── */

function getFirstAliveEnemy(enemies) {
  return enemies.find(e => e.currentHp > 0) ?? null;
}

function dealDamageToEnemy(enemies, targetId, dmg, log) {
  return enemies.map(e => {
    if (e.id !== targetId) return e;
    const defended = e.effects?.find(ef => ef.type === 'defended');
    const finalDmg = defended ? Math.floor(dmg * (defended.mult ?? 0.5)) : dmg;
    if (defended) log.push(`🛡️ ${e.name} 방어! 피해 감소.`);
    const newHp = Math.max(0, e.currentHp - finalDmg);
    if (newHp <= 0 && e.currentHp > 0) log.push(`💀 ${e.name} 쓰러짐!`);
    return { ...e, currentHp: newHp };
  });
}

function applyEffectToEnemy(enemies, targetId, effect, job) {
  const durationBonus = job === 'dominator' ? 1 : 0;
  return enemies.map(e =>
    e.id === targetId
      ? {
          ...e,
          effects: [...(e.effects ?? []), {
            ...effect,
            duration: effect.duration + durationBonus,
            id: (effect.type ?? 'ef') + '_' + Date.now() + Math.random(),
          }],
        }
      : e
  );
}

function pickAction(pattern) {
  const total = pattern.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of pattern) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return pattern[0];
}

function makeDebuffEffect(type) {
  const map = {
    stun:       { type: 'stun', duration: 1 },
    fear:       { type: 'fear', duration: 2, atkMult: 0.65 },
    suppressed: { type: 'stun', duration: 1 },
  };
  return map[type] ?? { type, duration: 1 };
}

/* ── 스태거 적용 헬퍼 ─────────────────────────── */
function applyStagger(enemies, targetId, amount, log) {
  return enemies.map(e => {
    if (e.id !== targetId) return e;
    if (e.currentHp <= 0) return e;
    if (!e.staggerMax) return e;
    // 이미 스태거 상태면 스킵
    if (e.effects?.find(ef => ef.type === 'staggered')) return e;
    const newStagger = Math.min(e.staggerMax, (e.staggerCurrent ?? 0) + amount);
    if (newStagger >= e.staggerMax) {
      const newEffects = [
        ...(e.effects ?? []),
        { type: 'staggered', duration: 1, id: 'staggered_' + Date.now() + Math.random() },
      ];
      log.push(`💥 **${e.name} 스태거!** 자세가 무너졌다! (1턴 동안 2배 피해 + 행동 불능)`);
      return { ...e, staggerCurrent: 0, effects: newEffects };
    }
    return { ...e, staggerCurrent: newStagger };
  });
}

/* ── 속성 약점/반감 적용 헬퍼 ──────────────────── */
function applyElementMod(dmg, element, enemy, log) {
  if (enemy.weakTo === element) {
    const result = Math.round(dmg * 1.5);
    log.push(`⚡ 약점! ${enemy.name}에게 **${result}** 피해.`);
    return result;
  }
  if (enemy.resistTo === element) {
    const result = Math.round(dmg * 0.75);
    log.push(`🛡 반감. ${enemy.name}에게 **${result}** 피해.`);
    return result;
  }
  log.push(`✨ ${enemy.name}에게 **${dmg}** 피해.`);
  return dmg;
}

export function getEffectDesc(effect) {
  const map = {
    stun:       '행동 불능',
    fear:       '공포',
    defended:   '방어 태세',
    exposed:    '약점 노출',
    dodge_next: '예지 회피',
    overdrive:  '오버드라이브',
    dominated:  '지배',
    burn:       '화상',
    poison:     '독',
    bleed:      '출혈',
    staggered:  '스태거',
  };
  return map[effect?.type] ?? effect?.type ?? '?';
}

function checkBossPhases(enemies, log) {
  return enemies.map(e => {
    if (!e.phases?.length || e.currentHp <= 0) return e;
    let updated = { ...e };
    const phases = updated.phases.map(phase => {
      if (phase.triggered) return phase;
      const hpRatio = updated.currentHp / updated.maxHp;
      if (hpRatio > phase.threshold) return phase;
      const { type, amount } = phase.effect;
      if (type === 'regen') {
        const actual = Math.min(amount, updated.maxHp - updated.currentHp);
        updated = { ...updated, currentHp: updated.currentHp + actual };
        log.push(`💢 **${updated.name} 페이즈 전환!** HP **+${actual}** 회복!`);
      } else if (type === 'atkUp') {
        updated = { ...updated, atk: updated.atk + amount };
        log.push(`💢 **${updated.name} 광폭화!** ATK **+${amount}**!`);
      }
      return { ...phase, triggered: true };
    });
    return { ...updated, phases };
  });
}
