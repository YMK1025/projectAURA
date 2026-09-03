import { create } from 'zustand';
import { LINEAGES } from '../data/lineages.js';
import { JOBS } from '../data/jobs.js';
import { SKILLS } from '../data/skills.js';
import { ITEMS } from '../data/items.js';
import { getNode } from '../data/chapters/index.js';
import {
  initCombat, playerAttack, playerSkill,
  playerDefend, useItemInCombat, enemyTurn,
} from '../engine/combat.js';
import { clampHp, clampMp, STAT_MAX } from '../engine/stats.js';

const INITIAL_RELATIONS = { jiyu: 0, kai: 0 };

/* ── 레벨업 누적 EXP 임계값 */
const EXP_TABLE = [0, 100, 250, 450, 700, 1050, 1500];

/* ── 계열별 레벨업 스탯 증가 */
const LEVEL_UP_GAINS = {
  physical: { power: 5, control: 2, mental: 1, maxHp: 28, maxMp: 8  },
  psychic:  { power: 1, control: 2, mental: 5, maxHp: 12, maxMp: 22 },
  nature:   { power: 2, control: 1, mental: 4, maxHp: 18, maxMp: 16 },
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
  mp: 0, maxMp: 0,
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
  inventory: [],
  equipment: {},

  /* ── 각성 */
  awakeningSkillId: null,
  awakeningDone: false,

  /* ── 전투 */
  combat: null,

  /* ── 엔딩 */
  endingType: null,

  /* ─────────────────────────────────────── */
  /* ACTIONS                                  */
  /* ─────────────────────────────────────── */

  setPlayerName: (name) => set({ playerName: name }),

  /* 1차: 계열 선택 → 게임 시작 (직업은 Ch2 클리어 후 선택) */
  chooseLineage(lineageId) {
    const lin = LINEAGES[lineageId];
    if (!lin) return;
    const commonSkill = lin.commonSkillId;
    set({
      lineage: lineageId,
      job: null,
      stats: { ...lin.initStats },
      hp: lin.initHp, maxHp: lin.initHp,
      mp: lin.initMp, maxMp: lin.initMp,
      skills: [commonSkill],
      skillLevels: { [commonSkill]: 1 },
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
  },

  /* 2차: 직업 선택 → 진행 중인 게임에 적용 후 Ch3 시작 */
  chooseJob(jobId) {
    const { lineage: lineageId, stats, maxHp, maxMp, hp, mp, skills, skillLevels } = get();
    const lin = LINEAGES[lineageId];
    const job = JOBS[jobId];
    if (!lin || !job) return;

    const newStats = {
      power:   Math.min(STAT_MAX, stats.power   + (job.statBonus?.power   ?? 0)),
      control: Math.min(STAT_MAX, stats.control + (job.statBonus?.control ?? 0)),
      mental:  Math.min(STAT_MAX, stats.mental  + (job.statBonus?.mental  ?? 0)),
    };
    const hpBonus  = job.maxHpBonus ?? 0;
    const newMaxHp = maxHp + hpBonus;
    const newHp    = Math.min(hp + hpBonus, newMaxHp);
    const jobSkill = job.jobSkillId;
    const newSkills = skills.includes(jobSkill) ? skills : [...skills, jobSkill];
    const newSkillLevels = { ...skillLevels };
    if (!newSkillLevels[jobSkill]) newSkillLevels[jobSkill] = 1;

    set({
      job: jobId,
      stats: newStats,
      maxHp: newMaxHp,
      hp: newHp,
      skills: newSkills,
      skillLevels: newSkillLevels,
    });
    get().goToNode('ch3_s0');
  },

  /* 스토리 선택지 */
  makeChoice(choice) {
    const { stats, relations, faction, flags } = get();
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

    set({
      stats: newStats,
      relations: newRelation,
      faction: newFaction,
      flags: newFlags,
      currentNodeId: choice.next,
      screen: nextNode.type === 'combat' ? 'combat' : nextNode.type,
      combat: nextNode.type === 'combat' ? initCombat(nextNode.enemies) : null,
    });
  },

  goToNode(nodeId) {
    if (nodeId === 'gameover')     { set({ screen: 'gameover' }); return; }
    if (nodeId === 'ending_aura')  { set({ screen: 'ending', endingType: 'aura' }); return; }
    if (nodeId === 'ending_nexus') { set({ screen: 'ending', endingType: 'nexus' }); return; }
    if (nodeId === 'job_select')   { set({ screen: 'job_select' }); return; }
    const node = getNode(nodeId);
    if (!node) return;
    set({
      currentNodeId: nodeId,
      screen: node.type === 'combat' ? 'combat' : node.type,
      combat: node.type === 'combat' ? initCombat(node.enemies) : null,
    });
  },

  /* ── 전투 액션 */
  doCombatAttack() {
    const { combat, stats, equipment, job, hp, maxHp } = get();
    const result = playerAttack(combat, stats, equipment, job);
    get()._afterPlayerAction(result, hp, maxHp);
  },

  doCombatSkill(skillId) {
    const { combat, stats, equipment, job, hp, maxHp, mp, skillLevels } = get();
    const result = playerSkill(combat, skillId, stats, equipment, job, mp, skillLevels);
    if (result.error) return;
    const { newCombat, newMp, hpDelta } = result;
    const newHp = clampHp(hp + (hpDelta ?? 0));
    get()._afterPlayerAction(newCombat, newHp, maxHp, newMp);
  },

  doCombatDefend() {
    const { combat, hp, maxHp, mp } = get();
    const result = playerDefend(combat);
    get()._afterPlayerAction(result, hp, maxHp, mp);
  },

  doCombatItem(itemId) {
    const { combat, inventory, hp, maxHp, mp, maxMp } = get();
    const idx = inventory.findIndex(i => i.id === itemId && i.qty > 0);
    if (idx < 0) return;
    const item = inventory[idx];
    const { newCombat, hpDelta, mpDelta } = useItemInCombat(
      combat, item, hp, maxHp, mp, maxMp
    );
    const newInv = inventory
      .map((it, i) => i === idx ? { ...it, qty: it.qty - 1 } : it)
      .filter(it => it.qty > 0);
    const newHp = clampHp(hp + hpDelta);
    const newMp = clampMp(mp + mpDelta);
    get()._afterPlayerAction(newCombat, newHp, maxHp, newMp, newInv);
  },

  _afterPlayerAction(newCombat, newHp, maxHp, newMp, newInv) {
    const { mp, inventory } = get();
    const usedMp  = newMp  !== undefined ? newMp  : mp;
    const usedInv = newInv !== undefined ? newInv : inventory;

    if (newCombat.phase === 'win') {
      get()._handleCombatWin(newCombat, newHp, usedMp, usedInv);
      return;
    }
    set({ combat: newCombat, hp: newHp, mp: usedMp, inventory: usedInv });
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

  /* 전투 승리 + 경험치/레벨업 */
  _handleCombatWin(newCombat, newHp, newMp, newInv) {
    const { currentNodeId, gold, level, totalExp, lineage, stats, maxHp, maxMp } = get();
    const node = getNode(currentNodeId);
    const goldGain = node?.goldReward ?? 0;
    const expGain  = newCombat.enemies.reduce((sum, e) => sum + (e.expReward ?? 0), 0);
    const newTotalExp = totalExp + expGain;

    let newLevel = level;
    let newStats = { ...stats };
    let newMaxHp = maxHp;
    let newMaxMp = maxMp;
    let gains = null;

    while (newLevel < EXP_TABLE.length - 1 && newTotalExp >= expForLevel(newLevel)) {
      newLevel++;
      const g = LEVEL_UP_GAINS[lineage] ?? { power: 2, control: 2, mental: 2, maxHp: 15, maxMp: 10 };
      newStats = applyStatChanges(newStats, { power: g.power, control: g.control, mental: g.mental });
      newMaxHp += g.maxHp;
      newMaxMp += g.maxMp;
      gains = g;
    }

    const didLevelUp = newLevel > level;

    set({
      combat: null,
      hp: Math.min(newHp, newMaxHp),
      mp: Math.min(newMp, newMaxMp),
      inventory: newInv,
      gold: gold + goldGain,
      totalExp: newTotalExp,
      expGainedLast: expGain,
      level: newLevel,
      stats: newStats,
      maxHp: newMaxHp,
      maxMp: newMaxMp,
      levelUpGains: didLevelUp ? gains : null,
    });

    if (didLevelUp) {
      set({ screen: 'levelup' });
    } else {
      const nextId = node?.onWin;
      if (nextId) get().goToNode(nextId);
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
    const { skillLevels, currentNodeId } = get();
    set({
      awakeningSkillId: skillId,
      skillLevels: { ...skillLevels, [skillId]: 4 },
    });
    const node = getNode(currentNodeId);
    const nextId = node?.onWin;
    if (nextId) get().goToNode(nextId);
  },

  /* 챕터 스킬 습득 */
  learnChapterSkill() {
    const { currentNodeId, lineage, skills, skillLevels } = get();
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
    set({ skills: newSkills, skillLevels: newLevels });
    if (node.next) get().goToNode(node.next);
  },

  /* 스킬 결정체 사용 */
  useSkillCrystal(itemId) {
    const { inventory, skills, skillLevels } = get();
    const upgradeable = skills.filter(id => (skillLevels[id] ?? 1) < 3);
    if (upgradeable.length === 0) return;
    const toUpgrade = upgradeable[0];
    const newLevels = { ...skillLevels, [toUpgrade]: (skillLevels[toUpgrade] ?? 1) + 1 };
    const newInv = inventory
      .map(it => it.id === itemId ? { ...it, qty: it.qty - 1 } : it)
      .filter(it => it.qty > 0);
    set({ skillLevels: newLevels, inventory: newInv });
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

  /* ── 휴식 */
  doRest() {
    const node = getNode(get().currentNodeId);
    if (!node?.restAmount) return;
    const { hp, maxHp, mp, maxMp } = get();
    const newHp = Math.min(maxHp, clampHp(hp + (node.restAmount.hp ?? 0)));
    const newMp = Math.min(maxMp, clampMp(mp + (node.restAmount.mp ?? 0)));
    set({ hp: newHp, mp: newMp });
    if (node.next) get().goToNode(node.next);
  },

  /* ── 리셋 */
  resetGame() {
    set({
      screen: 'title',
      playerName: '', lineage: null, job: null,
      stats: { power: 0, control: 0, mental: 0 },
      hp: 0, maxHp: 0, mp: 0, maxMp: 0,
      gold: 0,
      level: 1, totalExp: 0, expGainedLast: 0, levelUpGains: null,
      currentNodeId: 'ch1_s0',
      faction: 0, relations: { ...INITIAL_RELATIONS },
      flags: {},
      skills: [], skillLevels: {}, inventory: [], equipment: {},
      awakeningSkillId: null, awakeningDone: false,
      combat: null, endingType: null,
    });
  },
}));
