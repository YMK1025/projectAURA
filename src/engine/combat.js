import {
  calcPlayerAtk, calcEnemyAtk, calcPlayerDef, calcDamage,
  calcSkillDamage, calcHeal, calcMpCost, rollDodge,
  tickEffects, randInt, clampHp, clampMp
} from './stats.js';
import { SKILLS } from '../data/skills.js';
import { ENEMIES } from '../data/enemies.js';

/* ────────────────────────────────────────────
   전투 초기화
   enemies: string[] — enemy ID 배열
   ──────────────────────────────────────────── */
export function initCombat(enemies) {
  return {
    enemies: enemies.map(id => ({
      ...ENEMIES[id],
      currentHp: ENEMIES[id].maxHp,
      effects: [],
      phase: 1,
    })),
    playerEffects: [],
    log: [],
    round: 1,
    phase: 'player', // 'player' | 'enemy' | 'win' | 'lose'
  };
}

/* ────────────────────────────────────────────
   플레이어: 일반 공격
   반환: { newCombat, newHp, newMp, log[] }
   ──────────────────────────────────────────── */
export function playerAttack(combat, playerStats, equipment, ability) {
  const target = getFirstAliveEnemy(combat.enemies);
  if (!target) return { ...combat, phase: 'win' };

  const atk  = calcPlayerAtk(playerStats, combat.playerEffects);
  const tDef = target.def;
  let dmg    = calcDamage(atk, tDef);

  // 염동력 패시브 1.3×
  if (ability === 'telekinesis') dmg = Math.floor(dmg * 1.3);

  const log  = [`⚔️ 공격! ${target.name}에게 **${dmg}** 피해.`];
  const newEnemies = dealDamageToEnemy(combat.enemies, target.id, dmg, log);
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
export function playerSkill(combat, skillId, playerStats, equipment, ability, currentMp) {
  const skill   = SKILLS[skillId];
  const mpCost  = calcMpCost(skill.mpCost, equipment);
  if (currentMp < mpCost) return { error: 'MP 부족' };

  const log = [];
  let newMp = currentMp - mpCost;
  let newEnemies = [...combat.enemies];
  let newPlayerEffects = [...combat.playerEffects];
  let hpDelta = 0;
  let extraTurn = false;

  const target = getFirstAliveEnemy(newEnemies);

  if (skill.type === 'damage') {
    const tEffects = target?.effects ?? [];
    const dmg = calcSkillDamage(skill, playerStats, tEffects);
    if (skill.target === 'all_enemies') {
      log.push(`💥 ${skill.name}! 모든 적에게 **${dmg}** 피해.`);
      newEnemies = newEnemies.map(e =>
        e.currentHp > 0 ? { ...e, currentHp: Math.max(0, e.currentHp - dmg) } : e
      );
    } else {
      log.push(`✨ ${skill.name}! ${target.name}에게 **${dmg}** 피해.`);
      newEnemies = dealDamageToEnemy(newEnemies, target.id, dmg, log);
    }
  } else if (skill.type === 'heal') {
    const heal = calcHeal(skill, playerStats);
    hpDelta = heal;
    log.push(`💚 ${skill.name}! HP **+${heal}** 회복.`);
  } else if (skill.type === 'buff') {
    newPlayerEffects.push({ ...skill.effect, id: skillId + '_' + Date.now() });
    log.push(`🛡️ ${skill.name}! ${getEffectDesc(skill.effect)} 효과 적용.`);
  } else if (skill.type === 'debuff' && target) {
    newEnemies = applyEffectToEnemy(newEnemies, target.id, skill.effect);
    log.push(`🌀 ${skill.name}! ${target.name}에게 ${getEffectDesc(skill.effect)} 효과.`);
  } else if (skill.type === 'special') {
    if (skill.effect?.type === 'extra_turn') {
      extraTurn = true;
      log.push(`🌊 ${skill.name}! 추가 행동 획득!`);
    } else if (skill.effect?.type === 'dominated' && target) {
      // 지배: 적이 자기 자신을 공격
      const selfDmg = Math.floor(target.atk * 0.8);
      newEnemies = dealDamageToEnemy(newEnemies, target.id, selfDmg, log);
      log.push(`🧠 ${skill.name}! ${target.name}이(가) 자신을 공격! **${selfDmg}** 피해.`);
    }
  }

  const win = newEnemies.every(e => e.currentHp <= 0);
  return {
    newCombat: {
      ...combat,
      enemies: newEnemies,
      log: [...combat.log, ...log],
      phase: win ? 'win' : extraTurn ? 'player' : 'enemy',
      playerEffects: tickEffects(newPlayerEffects),
    },
    newMp,
    hpDelta,
  };
}

/* ────────────────────────────────────────────
   플레이어: 방어
   ──────────────────────────────────────────── */
export function playerDefend(combat) {
  const effect = { type: 'defended', duration: 1, mult: 0.5, id: 'defend_' + Date.now() };
  const log = ['🛡️ 방어 태세! 이번 턴 받는 피해 50% 감소.'];
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
   반환: { newCombat, hpDelta }
   ──────────────────────────────────────────── */
export function enemyTurn(combat, playerStats, equipment, ability, currentHp) {
  let log = [];
  let hpDelta = 0;
  let newPlayerEffects = [...combat.playerEffects];

  // 살아있는 적들이 순서대로 행동
  let newEnemies = [...combat.enemies];

  for (let i = 0; i < newEnemies.length; i++) {
    const e = newEnemies[i];
    if (e.currentHp <= 0) continue;

    // 스턴 체크
    const stun = e.effects?.find(ef => ef.type === 'stun');
    if (stun) {
      log.push(`😵 ${e.name}은(는) 혼란 상태로 행동 불능!`);
      newEnemies[i] = { ...e, effects: tickEffects(e.effects) };
      continue;
    }

    // 행동 선택
    const action = pickAction(e.pattern);

    if (action.action === 'attack') {
      const atkVal = calcEnemyAtk(e, e.effects);
      if (rollDodge(ability, newPlayerEffects)) {
        log.push(`💨 ${e.name}의 공격! — 회피!`);
      } else {
        const def = calcPlayerDef(playerStats, equipment, newPlayerEffects);
        const dmg = calcDamage(atkVal, def);
        hpDelta -= dmg;
        log.push(`🗡️ ${e.name}의 공격! **${dmg}** 피해.`);
        // dodge_next 소모
        newPlayerEffects = newPlayerEffects.filter(ef => ef.type !== 'dodge_next');
      }
    } else if (action.action === 'skill') {
      const rawDmg = Math.floor(e.atk * (action.skillDmgMult ?? 1));
      if (action.skillDmgMult > 0) {
        if (rollDodge(ability, newPlayerEffects)) {
          log.push(`💨 ${e.name}의 ${action.skillName}! — 회피!`);
          newPlayerEffects = newPlayerEffects.filter(ef => ef.type !== 'dodge_next');
        } else {
          const def = calcPlayerDef(playerStats, equipment, newPlayerEffects);
          const dmg = action.hits
            ? Array.from({ length: action.hits }, () => calcDamage(Math.floor(rawDmg / action.hits), def)).reduce((a, b) => a + b, 0)
            : calcDamage(rawDmg, def);
          hpDelta -= dmg;
          log.push(`⚡ ${e.name}의 **${action.skillName}**! **${dmg}** 피해.`);
        }
      }
      if (action.debuff) {
        const debuffEffect = makeDebuffEffect(action.debuff);
        newPlayerEffects.push(debuffEffect);
        log.push(`😨 ${e.name}이(가) ${getEffectDesc(debuffEffect)} 효과를 걸었다!`);
      }
    } else if (action.action === 'defend') {
      newEnemies[i] = { ...e, effects: [...(e.effects ?? []), { type: 'defended', duration: 1 }] };
      log.push(`🛡️ ${e.name}이(가) 방어 태세를 취한다.`);
    } else if (action.action === 'berserk') {
      const dmg = Math.floor(e.atk * 2);
      const def = calcPlayerDef(playerStats, equipment, newPlayerEffects);
      const finalDmg = calcDamage(dmg, def);
      hpDelta -= finalDmg;
      log.push(`💢 ${e.name}의 **광폭화**! **${finalDmg}** 피해!`);
    }

    // 턴 종료 시 상태이상 감소
    newEnemies[i] = { ...newEnemies[i], effects: tickEffects(newEnemies[i].effects ?? []) };
  }

  // 플레이어 상태이상 틱
  newPlayerEffects = tickEffects(newPlayerEffects);

  const newHp = currentHp + hpDelta;
  const phase = newHp <= 0 ? 'lose' : 'player';

  return {
    newCombat: {
      ...combat,
      enemies: newEnemies,
      log: [...combat.log, ...log],
      phase,
      playerEffects: newPlayerEffects,
      round: combat.round + 1,
    },
    hpDelta,
  };
}

/* ── 내부 헬퍼 ──────────────────────────── */

function getFirstAliveEnemy(enemies) {
  return enemies.find(e => e.currentHp > 0) ?? null;
}

function dealDamageToEnemy(enemies, targetId, dmg, log) {
  return enemies.map(e => {
    if (e.id !== targetId) return e;
    const defended = e.effects?.find(ef => ef.type === 'defended');
    const finalDmg = defended ? Math.floor(dmg * (defended.mult ?? 0.5)) : dmg;
    if (defended) log.push(`🛡️ ${e.name}의 방어로 피해 감소!`);
    const newHp = Math.max(0, e.currentHp - finalDmg);
    if (newHp <= 0) log.push(`💀 ${e.name} 쓰러짐!`);
    return { ...e, currentHp: newHp };
  });
}

function applyEffectToEnemy(enemies, targetId, effect) {
  return enemies.map(e =>
    e.id === targetId ? { ...e, effects: [...(e.effects ?? []), { ...effect, id: effect.type + '_' + Date.now() }] } : e
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
    stun:       { type: 'stun',  duration: 1 },
    fear:       { type: 'fear',  duration: 2, atkMult: 0.65 },
    suppressed: { type: 'stun',  duration: 1 }, // 능력 억제도 스턴으로 처리
  };
  return map[type] ?? { type, duration: 1 };
}

export function getEffectDesc(effect) {
  const map = {
    stun:       '행동 불능',
    fear:       '공포 (공격력 감소)',
    defended:   '방어 태세',
    exposed:    '약점 노출',
    dodge_next: '예지 회피',
    overdrive:  '오버드라이브',
    dominated:  '지배',
  };
  return map[effect?.type] ?? effect?.type ?? '알 수 없음';
}
