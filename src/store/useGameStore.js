import { create } from 'zustand';
import { LINEAGES } from '../data/lineages.js';
import { JOBS } from '../data/jobs.js';
import { SKILLS } from '../data/skills.js';
import { ITEMS } from '../data/items.js';
import { getNode } from '../data/chapters/index.js';
import { RANDOM_EVENTS } from '../data/randomEvents.js';
import {
  initCombat, playerAttack, playerSkill,
  playerDefend, useItemInCombat, enemyTurn,
} from '../engine/combat.js';
import { clampHp, STAT_MAX } from '../engine/stats.js';
import { DIFFICULTIES, getDifficulty } from '../data/difficulties.js';

/* ── localStorage 키 */
const PROGRESS_KEY = 'aura_progress';
const RUN_KEY = 'aura_run';

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : { unlockedDifficulties: [0], clearedDifficulties: {} };
  } catch { return { unlockedDifficulties: [0], clearedDifficulties: {} }; }
}

function saveProgress(data) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); } catch {}
}

function saveRun(state) {
  const fields = ['playerName','lineage','job','stats','hp','maxHp','gold','level',
    'totalExp','currentNodeId','faction','relations','skills','skillLevels',
    'skillCharges','inventory','equipment','awakeningSkillId','awakeningDone',
    'screen','flags','difficulty'];
  const run = {};
  fields.forEach(f => { run[f] = state[f]; });
  try { localStorage.setItem(RUN_KEY, JSON.stringify(run)); } catch {}
}

function loadRun() {
  try {
    const raw = localStorage.getItem(RUN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearRun() {
  try { localStorage.removeItem(RUN_KEY); } catch {}
}

export { loadProgress, loadRun, clearRun };

const INITIAL_RELATIONS = { jiyu: 0, kai: 0 };

/* ── 레벨업 누적 EXP 임계값 */
const EXP_TABLE = [0, 100, 250, 450, 700, 1050, 1500];

/* ── 계열별 레벨업 스탯 증가 */
const LEVEL_UP_GAINS = {
  physical: { power: 5, control: 2, mental: 1, maxHp: 28 },
  psychic:  { power: 1, control: 2, mental: 5, maxHp: 12 },
  nature:   { power: 2, control: 1, mental: 4, maxHp: 18 },
};

function applyStatChanges(stats, changes = {}) {
  const next = { ...stats };
  for (const [k, v] of Object.entries(changes)) {
    if (k in next) next[k] = Math.max(0, Math.min(STAT_MAX, next[k] + v));
  }
  return next;
}

function applyRelationChanges(relations, changes = {}) {
  const next = { ...relations };
  for (const [k, v] of Object.entries(changes)) next[k] = (next[k] ?? 0) + v;
  return next;
}

function expForLevel(lv) {
  return EXP_TABLE[Math.min(lv, EXP_TABLE.length - 1)] ?? 9999;
}

export const useGameStore = create((set, get) => ({
  /* ── 화면 */
  screen: 'title',

  /* ── 플레이어 기본 */
  playerName: '',
  lineage: null,
  job: null,
  stats: { power: 0, control: 0, mental: 0 },
  hp: 0, maxHp: 0,
  gold: 0,

  /* ── 레벨 / 경험치 */
  level: 1,
  totalExp: 0,
  expGainedLast: 0,
  levelUpGains: null,

  /* ── 진행 */
  currentNodeId: 'ch1_s0',
  faction: 0,
  relations: { ...INITIAL_RELATIONS },
  flags: {},
  skills: [],
  skillLevels: {},
  skillCharges: {},
  inventory: [],
  equipment: {},

  /* ── 각성 */
  awakeningSkillId: null,
  awakeningDone: false,

  /* ── 전투 */
  combat: null,
  combatReward: null,

  /* ── 랜덤 이벤트 */
  currentRandomEvent: null,
  currentRandomEventNodeId: null,

  /* ── 엔딩 */
  endingType: null,

  /* ── 난이도 */
  difficulty: 1,

  /* ─────────────────────────────────────── */
  /* ACTIONS                                  */
  /* ─────────────────────────────────────── */

  setPlayerName: (name) => set({ playerName: name }),

  setDifficulty: (id) => set({ difficulty: id }),

  /* 1차: 계열 선택 → 게임 시작 (직업은 Ch2 클리어 후 선택) */
  chooseLineage(lineageId) {
    const lin = LINEAGES[lineageId];
    if (!lin) return;
    const commonSkill = lin.commonSkillId;
    const diff = getDifficulty(get().difficulty);
    const initHp = diff.startHp;
    const chargeBonus = diff.chargeBonus;
    set({
      lineage: lineageId,
      job: null,
      stats: { ...lin.initStats },
      hp: initHp, maxHp: initHp,
      skills: [commonSkill],
      skillLevels: { [commonSkill]: 1 },
      skillCharges: { [commonSkill]: Math.max(1, (SKILLS[commonSkill]?.maxCharges ?? 3) + chargeBonus) },
      screen: 'story',
      currentNodeId: 'ch1_s0',
      faction: 0,
      relations: { ...INITIAL_RELATIONS },
      inventory: [],
      equipment: {},
      gold: 0,
      level: 1,
      totalExp: 0,
      expGainedLast: 0,
      levelUpGains: null,
    });
    saveRun(get());
  },

  /* 2차: 직업 선택 → 진행 중인 게임에 적용 후 Ch3 시작 */
  chooseJob(jobId) {
    const { lineage: lineageId, stats, maxHp, hp, skills, skillLevels, skillCharges } = get();
    const lin = LINEAGES[lineageId];
    const job = JOBS[jobId];
    if (!lin || !job) return;

    const newStats = {
      power:   Math.min(STAT_MAX, stats.power   + (job.statBonus?.power   ?? 0)),
      control: Math.min(STAT_MAX, stats.control + (job.statBonus?.control ?? 0)),
      mental:  Math.min(STAT_MAX, stats.mental  + (job.statBonus?.mental  ?? 0)),
    };
    const jobSkill = job.jobSkillId;
    const newSkills = skills.includes(jobSkill) ? skills : [...skills, jobSkill];
    const newSkillLevels = { ...skillLevels };
    if (!newSkillLevels[jobSkill]) newSkillLevels[jobSkill] = 1;
    const newSkillCharges = { ...skillCharges };
    if (!newSkillCharges[jobSkill]) newSkillCharges[jobSkill] = SKILLS[jobSkill]?.maxCharges ?? 3;

    set({
      job: jobId,
      stats: newStats,
      maxHp,
      hp,
      skills: newSkills,
      skillLevels: newSkillLevels,
      skillCharges: newSkillCharges,
    });
    get().goToNode('ch3_s0');
  },

  /* 스토리 선택지 */
  makeChoice(choice) {
    const { stats, relations, faction, flags, difficulty } = get();
    const newStats    = applyStatChanges(stats, choice.statChanges);
    const newRelation = applyRelationChanges(relations, choice.relation ?? {});
    const newFaction  = Math.max(-100, Math.min(100, faction + (choice.faction ?? 0)));

    /* 플래그 처리 */
    let newFlags = { ...flags };
    if (choice.setFlag) {
      const toSet = Array.isArray(choice.setFlag) ? choice.setFlag : [choice.setFlag];
      for (const f of toSet) newFlags[f] = true;
    }

    const nextNode = getNode(choice.next);
    if (!nextNode) return;

    const diff = getDifficulty(difficulty);
    set({
      stats: newStats,
      relations: newRelation,
      faction: newFaction,
      flags: newFlags,
      currentNodeId: choice.next,
      screen: nextNode.type === 'combat' ? 'combat' : nextNode.type,
      combat: nextNode.type === 'combat' ? initCombat(nextNode.enemies, diff.enemyMult) : null,
    });
    saveRun(get());
  },

  goToNode(nodeId) {
    if (nodeId === 'gameover')     { clearRun(); set({ screen: 'gameover' }); return; }
    if (nodeId === 'ending_aura' || nodeId === 'ending_nexus') {
      const diff = get().difficulty;
      const prog = loadProgress();
      prog.clearedDifficulties[diff] = nodeId === 'ending_aura' ? 'aura' : 'nexus';
      if (!prog.unlockedDifficulties.includes(diff + 1) && diff + 1 < 5) {
        prog.unlockedDifficulties.push(diff + 1);
      }
      saveProgress(prog);
      clearRun();
      set({ screen: 'ending', endingType: nodeId === 'ending_aura' ? 'aura' : 'nexus' });
      return;
    }
    if (nodeId === 'job_select')   { set({ screen: 'job_select' }); return; }
    const node = getNode(nodeId);
    if (!node) return;
    if (node.type === 'random_event') {
      const pool = node.pool;
      const ev = RANDOM_EVENTS[pool[Math.floor(Math.random() * pool.length)]];
      if (!ev) return;
      set({
        currentRandomEvent: ev,
        currentRandomEventNodeId: nodeId,
        currentNodeId: nodeId,
        screen: 'random_event',
      });
      saveRun(get());
      return;
    }
    const diff = getDifficulty(get().difficulty);
    set({
      currentNodeId: nodeId,
      screen: node.type === 'combat' ? 'combat' : node.type,
      combat: node.type === 'combat' ? initCombat(node.enemies, diff.enemyMult) : null,
    });
    saveRun(get());
  },

  resolveRandomEvent(choice) {
    const { stats, gold, hp, maxHp, flags, currentRandomEventNodeId } = get();
    const newStats = applyStatChanges(stats, choice.statChanges);
    const newGold  = gold + (choice.goldChange ?? 0);
    const newHp    = Math.min(maxHp, clampHp(hp + (choice.hpChange ?? 0)));
    let newFlags = { ...flags };
    if (choice.setFlag) {
      const toSet = Array.isArray(choice.setFlag) ? choice.setFlag : [choice.setFlag];
      for (const f of toSet) newFlags[f] = true;
    }
    set({
      stats: newStats,
      gold: newGold,
      hp: newHp,
      flags: newFlags,
      currentRandomEvent: null,
      currentRandomEventNodeId: null,
    });
    const node = getNode(currentRandomEventNodeId);
    if (node?.next) get().goToNode(node.next);
  },

  /* ── 전투 액션 */
  doCombatAttack() {
    const { combat, stats, equipment, job, hp, maxHp, skillCharges, inventory } = get();
    const result = playerAttack(combat, stats, equipment, job);
    get()._afterPlayerAction(result, hp, maxHp, skillCharges, inventory);
  },

  doCombatSkill(skillId) {
    const { combat, stats, equipment, job, hp, maxHp, skillLevels, skillCharges, inventory } = get();
    if ((skillCharges[skillId] ?? 0) <= 0) return;
    const result = playerSkill(combat, skillId, stats, equipment, job, skillLevels);
    if (result.error) return;
    const { newCombat, hpDelta } = result;
    const newHp = clampHp(hp + (hpDelta ?? 0));
    const newCharges = { ...skillCharges, [skillId]: skillCharges[skillId] - 1 };
    get()._afterPlayerAction(newCombat, newHp, maxHp, newCharges, inventory);
  },

  doCombatDefend() {
    const { combat, hp, maxHp, skillCharges, inventory } = get();
    const result = playerDefend(combat);
    get()._afterPlayerAction(result, hp, maxHp, skillCharges, inventory);
  },

  doCombatItem(itemId) {
    const { combat, inventory, hp, maxHp, skillCharges } = get();
    const idx = inventory.findIndex(i => i.id === itemId && i.qty > 0);
    if (idx < 0) return;
    const item = inventory[idx];
    const { newCombat, hpDelta } = useItemInCombat(
      combat, item, hp, maxHp, 0, 0
    );
    const newInv = inventory
      .map((it, i) => i === idx ? { ...it, qty: it.qty - 1 } : it)
      .filter(it => it.qty > 0);
    const newHp = clampHp(hp + hpDelta);
    get()._afterPlayerAction(newCombat, newHp, maxHp, skillCharges, newInv);
  },

  _afterPlayerAction(newCombat, newHp, maxHp, newCharges, newInv) {
    const { skillCharges, inventory } = get();
    const usedCharges = newCharges !== undefined ? newCharges : skillCharges;
    const usedInv     = newInv    !== undefined ? newInv    : inventory;

    if (newCombat.phase === 'win') {
      get()._handleCombatWin(newCombat, newHp, usedCharges, usedInv);
      return;
    }
    set({ combat: newCombat, hp: newHp, skillCharges: usedCharges, inventory: usedInv });
    if (newCombat.phase === 'enemy') get().doEnemyTurn();
  },

  doEnemyTurn() {
    const { combat, stats, equipment, job, hp } = get();
    const { newCombat, hpDelta } = enemyTurn(combat, stats, equipment, job, hp);
    const newHp = clampHp(hp + hpDelta);
    if (newCombat.phase === 'lose' || newHp <= 0) {
      set({ combat: newCombat, hp: 0, screen: 'gameover' });
      return;
    }
    set({ combat: newCombat, hp: newHp });
  },

  /* 전투 승리 + 경험치/레벨업 + 보상 선택 */
  _handleCombatWin(newCombat, newHp, newCharges, newInv) {
    const { currentNodeId, gold, level, totalExp, lineage, stats, maxHp, skills, skillLevels, difficulty } = get();
    const node = getNode(currentNodeId);
    const goldGain = node?.goldReward ?? 0;
    const expGain  = newCombat.enemies.reduce((sum, e) => sum + (e.expReward ?? 0), 0);
    const newTotalExp = totalExp + expGain;

    let newLevel = level;
    let newStats = { ...stats };
    let newMaxHp = maxHp;
    let gains = null;

    while (newLevel < EXP_TABLE.length - 1 && newTotalExp >= expForLevel(newLevel)) {
      newLevel++;
      const g = LEVEL_UP_GAINS[lineage] ?? { power: 2, control: 2, mental: 2, maxHp: 15 };
      newStats = applyStatChanges(newStats, { power: g.power, control: g.control, mental: g.mental });
      newMaxHp += g.maxHp;
      gains = g;
    }

    const didLevelUp = newLevel > level;

    set({
      combat: null,
      hp: Math.min(newHp, newMaxHp),
      inventory: newInv,
      gold: gold + goldGain,
      totalExp: newTotalExp,
      expGainedLast: expGain,
      level: newLevel,
      stats: newStats,
      maxHp: newMaxHp,
      skillCharges: newCharges,
      levelUpGains: didLevelUp ? gains : null,
    });

    /* ── 보상 생성 (Slay the Spire 스타일) */
    const rewardBonus = getDifficulty(difficulty).rewardBonus;
    function pickGrade() {
      const r = Math.random() * 100;
      const legendaryThreshold = 4 * rewardBonus;
      const epicThreshold = legendaryThreshold + 13 * rewardBonus;
      const rareThreshold = epicThreshold + 28;
      if (r < legendaryThreshold) return 'legendary';
      if (r < epicThreshold) return 'epic';
      if (r < rareThreshold) return 'rare';
      return 'common';
    }

    function generateRewardOption(grade) {
      const typePools = {
        common:    ['stat', 'charge_restore', 'item', 'maxhp'],
        rare:      ['stat', 'charge_restore', 'item', 'maxhp', 'skill_upgrade', 'skill'],
        epic:      ['stat', 'charge_restore', 'item', 'skill_upgrade', 'skill'],
        legendary: ['stat', 'item', 'skill_upgrade', 'maxhp'],
      };
      const types = typePools[grade];
      const type  = types[Math.floor(Math.random() * types.length)];
      const statNames = { power: '파워', mental: '정신', control: '제어' };

      if (type === 'stat') {
        const statList = ['power', 'mental', 'control'];
        const stat     = statList[Math.floor(Math.random() * statList.length)];
        const amounts  = { common: 2, rare: 3, epic: 4, legendary: 6 };
        const amount   = amounts[grade];
        return { type: 'stat', grade, stat, amount, label: `${statNames[stat]} +${amount}`, desc: '능력치가 영구적으로 상승한다' };
      }

      if (type === 'maxhp') {
        const amounts = { common: 15, rare: 25, epic: 40, legendary: 60 };
        const amount  = amounts[grade];
        return { type: 'maxhp', grade, amount, label: `최대 HP +${amount}`, desc: '체력 한계가 영구적으로 상승한다' };
      }

      if (type === 'charge_restore') {
        if (grade === 'common') return { type: 'charges', grade, amount: 1, label: '스킬 재충전 +1', desc: '모든 스킬 횟수 +1 회복' };
        if (grade === 'rare')   return { type: 'charges', grade, amount: 2, label: '스킬 재충전 +2', desc: '모든 스킬 횟수 +2 회복' };
        return { type: 'charges', grade, amount: 99, label: '스킬 완전 회복', desc: '모든 스킬 횟수를 완전히 회복한다' };
      }

      if (type === 'skill_upgrade') {
        const upgradeable = skills.filter(id => (skillLevels[id] ?? 1) < 3);
        if (upgradeable.length === 0) {
          const stat    = ['power', 'mental', 'control'][Math.floor(Math.random() * 3)];
          const amounts = { common: 2, rare: 3, epic: 4, legendary: 6 };
          return { type: 'stat', grade, stat, amount: amounts[grade], label: `${statNames[stat]} +${amounts[grade]}`, desc: '능력치가 영구적으로 상승한다' };
        }
        const targetId = upgradeable[Math.floor(Math.random() * upgradeable.length)];
        return { type: 'skill_upgrade', grade, skillId: targetId, label: '스킬 강화: 레벨 업', desc: '보유 스킬의 레벨이 상승한다' };
      }

      if (type === 'item') {
        const pool = Object.values(ITEMS).filter(it => it.grade === grade && it.type === 'consumable');
        if (pool.length === 0) {
          return { type: 'charges', grade: 'common', amount: 1, label: '스킬 재충전 +1', desc: '모든 스킬 횟수 +1 회복' };
        }
        const item = pool[Math.floor(Math.random() * pool.length)];
        return { type: 'item', grade, itemId: item.id, label: `${item.emoji} ${item.name}`, desc: item.desc };
      }

      if (type === 'skill') {
        const lineageSkills = Object.values(SKILLS).filter(s => s.lineage === lineage);
        if (lineageSkills.length === 0) {
          const stat = ['power', 'mental', 'control'][Math.floor(Math.random() * 3)];
          const amounts = { common: 2, rare: 3, epic: 4, legendary: 6 };
          const statNames = { power: '파워', mental: '정신', control: '제어' };
          return { type: 'stat', grade, stat, amount: amounts[grade], label: `${statNames[stat]} +${amounts[grade]}`, desc: '능력치가 영구적으로 상승한다' };
        }
        const unowned = lineageSkills.filter(s => !skills.includes(s.id));
        const upgradeable = lineageSkills.filter(s => skills.includes(s.id) && (skillLevels[s.id] ?? 1) < 3);
        let targetSkill, isUpgrade;
        if (grade === 'epic' || grade === 'legendary') {
          const pool = unowned.length > 0 ? unowned : upgradeable;
          if (pool.length === 0) return null;
          targetSkill = pool[Math.floor(Math.random() * pool.length)];
          isUpgrade = upgradeable.includes(targetSkill);
        } else {
          const pool = [...unowned, ...upgradeable];
          if (pool.length === 0) return null;
          targetSkill = pool[Math.floor(Math.random() * pool.length)];
          isUpgrade = skills.includes(targetSkill.id);
        }
        if (!targetSkill) return null;
        const action = isUpgrade ? '레벨 업' : '신규 획득';
        return {
          type: 'skill', grade, skillId: targetSkill.id,
          label: `${targetSkill.emoji} ${targetSkill.name} ${action}`,
          desc: isUpgrade
            ? `스킬 레벨이 ${(skillLevels[targetSkill.id] ?? 1) + 1}로 상승한다`
            : `새 스킬을 습득한다 (현재 스킬과 동일 레벨)`,
          isUpgrade,
        };
      }

      // fallback
      return { type: 'charges', grade: 'common', amount: 1, label: '스킬 재충전 +1', desc: '모든 스킬 횟수 +1 회복' };
    }

    /* 3개 옵션 생성 — 같은 type+grade 중복 방지 */
    const options = [];
    const seen    = new Set();
    let attempts  = 0;
    while (options.length < 3 && attempts < 30) {
      attempts++;
      const grade  = pickGrade();
      let option = generateRewardOption(grade);
      if (option === null) {
        // skill 풀이 비었을 때 stat으로 대체
        const stat = ['power', 'mental', 'control'][Math.floor(Math.random() * 3)];
        const amounts = { common: 2, rare: 3, epic: 4, legendary: 6 };
        const statNames = { power: '파워', mental: '정신', control: '제어' };
        option = { type: 'stat', grade, stat, amount: amounts[grade], label: `${statNames[stat]} +${amounts[grade]}`, desc: '능력치가 영구적으로 상승한다' };
      }
      const key    = `${option.type}|${option.grade}|${option.stat ?? option.skillId ?? option.itemId ?? ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      options.push(option);
    }

    set({
      combatReward: { options, pendingNode: node?.onWin },
      screen: 'combat_reward',
    });
    saveRun(get());
  },

  chooseCombatReward(option) {
    const { hp, maxHp, stats, gold, skills, skillLevels, skillCharges, inventory, combatReward, levelUpGains } = get();
    let newHp          = hp;
    let newMaxHp       = maxHp;
    let newStats       = { ...stats };
    let newGold        = gold;
    let newCharges     = { ...skillCharges };
    let newSkillLevels = { ...skillLevels };
    let newPlayerSkills = [...skills];
    let newInv         = [...inventory];

    if (option.type === 'stat') {
      newStats = applyStatChanges(newStats, { [option.stat]: option.amount });
    }

    if (option.type === 'maxhp') {
      newMaxHp = maxHp + option.amount;
      newHp    = Math.min(newHp + option.amount, newMaxHp);
    }

    if (option.type === 'charges') {
      if (option.amount === 99) {
        // 완전 회복
        skills.forEach(id => {
          newCharges[id] = SKILLS[id]?.maxCharges ?? 3;
        });
      } else {
        skills.forEach(id => {
          const maxC = SKILLS[id]?.maxCharges ?? 3;
          newCharges[id] = Math.min(maxC, (newCharges[id] ?? 0) + option.amount);
        });
      }
    }

    if (option.type === 'skill_upgrade') {
      const lv = Math.min(3, (skillLevels[option.skillId] ?? 1) + 1);
      newSkillLevels = { ...skillLevels, [option.skillId]: lv };
      // 스킬 횟수를 maxCharges로 리셋
      newCharges[option.skillId] = SKILLS[option.skillId]?.maxCharges ?? 3;
    }

    if (option.type === 'item') {
      const itemData = ITEMS[option.itemId];
      if (itemData) {
        const idx = newInv.findIndex(i => i.id === option.itemId);
        if (idx >= 0) {
          newInv = newInv.map((it, i) => i === idx ? { ...it, qty: it.qty + 1 } : it);
        } else {
          newInv = [...newInv, { ...itemData, qty: 1 }];
        }
      }
    }

    if (option.type === 'skill') {
      const skillId = option.skillId;
      if (newPlayerSkills.includes(skillId)) {
        // 레벨 업
        const curLv = newSkillLevels[skillId] ?? 1;
        const newLv = Math.min(3, curLv + 1);
        newSkillLevels = { ...newSkillLevels, [skillId]: newLv };
        newCharges = { ...newCharges, [skillId]: SKILLS[skillId]?.maxCharges ?? 3 };
      } else {
        // 신규 획득 — 보유 스킬 평균 레벨로 지급
        const avgLv = newPlayerSkills.length > 0
          ? Math.max(1, Math.round(newPlayerSkills.reduce((sum, id) => sum + (newSkillLevels[id] ?? 1), 0) / newPlayerSkills.length))
          : 1;
        newSkillLevels = { ...newSkillLevels, [skillId]: Math.min(3, avgLv) };
        newCharges = { ...newCharges, [skillId]: SKILLS[skillId]?.maxCharges ?? 3 };
        newPlayerSkills = [...newPlayerSkills, skillId];
      }
    }

    if (option.type === 'gold') {
      newGold = gold + (option.amount ?? 0);
    }

    const nextNode = combatReward?.pendingNode;
    set({
      hp: newHp,
      maxHp: newMaxHp,
      stats: newStats,
      gold: newGold,
      skills: newPlayerSkills,
      skillCharges: newCharges,
      skillLevels: newSkillLevels,
      inventory: newInv,
      combatReward: null,
    });

    if (levelUpGains) {
      set({ screen: 'levelup' });
      saveRun(get());
    } else if (nextNode) {
      get().goToNode(nextNode);
    }
  },

  confirmLevelUp() {
    const { level, awakeningDone } = get();
    const node = getNode(get().currentNodeId);
    const nextId = node?.onWin;
    set({ levelUpGains: null });
    if (level >= EXP_TABLE.length - 1 && !awakeningDone) {
      set({ screen: 'skill_awakening', awakeningDone: true });
      return;
    }
    if (nextId) get().goToNode(nextId);
  },

  chooseAwakening(skillId) {
    const { skillLevels, skillCharges, currentNodeId } = get();
    set({
      awakeningSkillId: skillId,
      skillLevels: { ...skillLevels, [skillId]: 4 },
      skillCharges: { ...skillCharges, [skillId]: SKILLS[skillId]?.maxCharges ?? 2 },
    });
    const node = getNode(currentNodeId);
    const nextId = node?.onWin;
    if (nextId) get().goToNode(nextId);
  },

  /* 챕터 스킬 습득 */
  learnChapterSkill() {
    const { currentNodeId, lineage, skills, skillLevels, skillCharges } = get();
    const node = getNode(currentNodeId);
    if (!node?.skillByLineage) return;
    const skillId = node.skillByLineage[lineage];
    if (!skillId) {
      if (node.next) get().goToNode(node.next);
      return;
    }
    const newSkills = skills.includes(skillId) ? skills : [...skills, skillId];
    const newLevels = { ...skillLevels };
    if (!newLevels[skillId]) newLevels[skillId] = 1;
    const newCharges = { ...skillCharges };
    if (!newCharges[skillId]) newCharges[skillId] = SKILLS[skillId]?.maxCharges ?? 3;
    set({ skills: newSkills, skillLevels: newLevels, skillCharges: newCharges });
    if (node.next) get().goToNode(node.next);
  },

  /* 스킬 결정체 사용 */
  useSkillCrystal(itemId) {
    const { inventory, skills, skillLevels, skillCharges } = get();
    const upgradeable = skills.filter(id => (skillLevels[id] ?? 1) < 3);
    if (upgradeable.length === 0) return;
    const toUpgrade = upgradeable[0];
    const newLevels = { ...skillLevels, [toUpgrade]: (skillLevels[toUpgrade] ?? 1) + 1 };
    const maxC = SKILLS[toUpgrade]?.maxCharges ?? 3;
    const newCharges = { ...skillCharges, [toUpgrade]: maxC };
    const newInv = inventory
      .map(it => it.id === itemId ? { ...it, qty: it.qty - 1 } : it)
      .filter(it => it.qty > 0);
    set({ skillLevels: newLevels, skillCharges: newCharges, inventory: newInv });
  },

  /* ── 상점 */
  buyItem(item) {
    const { gold, inventory } = get();
    if (gold < item.price) return;
    const idx = inventory.findIndex(i => i.id === item.id);
    const newInv = idx >= 0
      ? inventory.map((it, i) => i === idx ? { ...it, qty: it.qty + 1 } : it)
      : [...inventory, { ...item, qty: 1 }];
    set({ gold: gold - item.price, inventory: newInv });
  },

  equipItem(item) {
    const { equipment, inventory } = get();
    const slot = item.slot;
    if (!slot) return;
    const newInv = inventory
      .map(it => it.id === item.id ? { ...it, qty: it.qty - 1 } : it)
      .filter(it => it.qty > 0);
    set({ equipment: { ...equipment, [slot]: item }, inventory: newInv });
  },

  /* ── 이어하기 */
  continueRun() {
    const saved = loadRun();
    if (!saved) return;
    set({ ...saved, combat: null, combatReward: null, levelUpGains: null });
  },

  /* ── 리셋 */
  resetGame() {
    clearRun();
    set({
      screen: 'title',
      playerName: '', lineage: null, job: null,
      stats: { power: 0, control: 0, mental: 0 },
      hp: 0, maxHp: 0,
      gold: 0,
      level: 1, totalExp: 0, expGainedLast: 0, levelUpGains: null,
      currentNodeId: 'ch1_s0',
      faction: 0, relations: { ...INITIAL_RELATIONS },
      flags: {},
      skills: [], skillLevels: {}, skillCharges: {}, inventory: [], equipment: {},
      awakeningSkillId: null, awakeningDone: false,
      combat: null, combatReward: null, endingType: null,
      currentRandomEvent: null, currentRandomEventNodeId: null,
      difficulty: 1,
    });
  },
}));
