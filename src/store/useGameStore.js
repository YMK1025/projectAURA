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
      hp: 100, maxHp: 100,
      skills: [commonSkill],
      skillLevels: { [commonSkill]: 1 },
      skillCharges: { [commonSkill]: SKILLS[commonSkill]?.maxCharges ?? 3 },
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
      return;
    }
    set({
      currentNodeId: nodeId,
      screen: node.type === 'combat' ? 'combat' : node.type,
      combat: node.type === 'combat' ? initCombat(node.enemies) : null,
    });
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
    const { currentNodeId, gold, level, totalExp, lineage, stats, maxHp } = get();
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

    /* 보상 풀 생성 */
    const rewardPool = [];
    if (newHp < newMaxHp * 0.7) {
      rewardPool.push({ type: 'hp', amount: 60, label: 'HP +60 회복', desc: '전투의 상처를 회복한다' });
    }
    rewardPool.push({ type: 'stat', stat: 'power',   amount: 2, label: '파워 +2',  desc: '신체 능력이 강화된다' });
    rewardPool.push({ type: 'stat', stat: 'mental',  amount: 2, label: '정신 +2',  desc: '정신력이 강화된다' });
    rewardPool.push({ type: 'stat', stat: 'control', amount: 2, label: '제어 +2',  desc: '능력 제어가 정교해진다' });
    rewardPool.push({ type: 'charges', label: '스킬 재충전', desc: '보유한 모든 스킬 횟수 +1 회복' });
    rewardPool.push({ type: 'gold', amount: 50, label: '골드 +50', desc: '전투 보상을 획득한다' });

    const shuffled = rewardPool.sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 3);

    set({
      combatReward: { options, pendingNode: node?.onWin },
      screen: 'combat_reward',
    });
  },

  chooseCombatReward(option) {
    const { hp, maxHp, stats, gold, skills, skillCharges, combatReward, levelUpGains } = get();
    let newHp      = hp;
    let newStats   = { ...stats };
    let newGold    = gold;
    let newCharges = { ...skillCharges };

    if (option.type === 'hp') {
      newHp = Math.min(maxHp, clampHp(hp + option.amount));
    }
    if (option.type === 'stat') {
      newStats = applyStatChanges(newStats, { [option.stat]: option.amount });
    }
    if (option.type === 'gold') {
      newGold = gold + option.amount;
    }
    if (option.type === 'charges') {
      skills.forEach(id => {
        const maxC = SKILLS[id]?.maxCharges ?? 3;
        newCharges[id] = Math.min(maxC, (newCharges[id] ?? 0) + 1);
      });
    }

    const nextNode = combatReward?.pendingNode;
    set({ hp: newHp, stats: newStats, gold: newGold, skillCharges: newCharges, combatReward: null });

    if (levelUpGains) {
      set({ screen: 'levelup' });
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

  /* ── 리셋 */
  resetGame() {
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
    });
  },
}));
