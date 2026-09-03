import { create } from 'zustand';
import { ABILITIES } from '../data/abilities.js';
import { ABILITY_SKILLS } from '../data/skills.js';
import { getNode } from '../data/chapters/index.js';
import { ITEMS, SHOP_INVENTORIES } from '../data/items.js';
import {
  initCombat, playerAttack, playerSkill,
  playerDefend, useItemInCombat, enemyTurn,
} from '../engine/combat.js';
import { clampHp, clampMp, STAT_MAX } from '../engine/stats.js';

const INITIAL_RELATIONS = { jiyu: 0, kai: 0 };

/* ── 레벨업 누적 EXP 임계값 (레벨 1 → n+1 에 필요한 총 경험치) */
const EXP_TABLE = [0, 100, 250, 450, 700, 1050, 1500];

/* ── 능력별 레벨업 스탯 증가량 */
const LEVEL_UP_GAINS = {
  telekinesis:  { power: 4, control: 1, mental: 1, maxHp: 15, maxMp: 10 },
  clairvoyance: { power: 1, control: 2, mental: 4, maxHp: 10, maxMp: 20 },
  mindControl:  { power: 1, control: 3, mental: 3, maxHp: 10, maxMp: 20 },
  regeneration: { power: 2, control: 1, mental: 3, maxHp: 25, maxMp: 10 },
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
  for (const [k, v] of Object.entries(changes)) {
    next[k] = (next[k] ?? 0) + v;
  }
  return next;
}

/* 레벨에 해당하는 필요 누적 exp 반환 */
function expForLevel(lv) {
  return EXP_TABLE[Math.min(lv, EXP_TABLE.length - 1)] ?? 9999;
}

export const useGameStore = create((set, get) => ({
  /* ── 화면 ── */
  screen: 'title',

  /* ── 플레이어 기본 ── */
  playerName: '',
  ability: null,
  stats: { power: 0, control: 0, mental: 0 },
  hp: 0, maxHp: 0,
  mp: 0, maxMp: 0,
  gold: 0,

  /* ── 레벨 / 경험치 ── */
  level: 1,
  totalExp: 0,       // 누적 획득 exp
  expGainedLast: 0,  // 마지막 전투 획득 exp (레벨업 화면 표시용)
  levelUpGains: null, // 레벨업 시 실제 적용된 스탯 증가량

  /* ── 진행 ── */
  currentNodeId: 'ch1_s0',
  faction: 0,
  relations: { ...INITIAL_RELATIONS },
  skills: [],
  inventory: [],
  equipment: {},

  /* ── 전투 ── */
  combat: null,

  /* ── 엔딩 ── */
  endingType: null,

  /* ─────────────────────────────────────── */
  /* ACTIONS                                  */
  /* ─────────────────────────────────────── */

  setPlayerName: (name) => set({ playerName: name }),

  chooseAbility(abilityId) {
    const ab = ABILITIES[abilityId];
    set({
      ability: abilityId,
      stats: { ...ab.initStats },
      hp: ab.initHp, maxHp: ab.initHp,
      mp: ab.initMp, maxMp: ab.initMp,
      skills: [...ABILITY_SKILLS[abilityId]],
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

  /* 스토리 / 이벤트 선택지 */
  makeChoice(choice) {
    const { stats, relations, faction, hp, maxHp, mp, maxMp } = get();
    const newStats    = applyStatChanges(stats, choice.statChanges);
    const newRelation = applyRelationChanges(relations, choice.relation ?? {});
    const newFaction  = Math.max(-100, Math.min(100, faction + (choice.faction ?? 0)));

    const nextNode = getNode(choice.next);
    if (!nextNode) return;

    set({
      stats: newStats,
      relations: newRelation,
      faction: newFaction,
      currentNodeId: choice.next,
      screen: nextNode.type === 'combat' ? 'combat' : nextNode.type,
      combat: nextNode.type === 'combat' ? initCombat(nextNode.enemies) : null,
    });
  },

  goToNode(nodeId) {
    if (nodeId === 'gameover')     { set({ screen: 'gameover' }); return; }
    if (nodeId === 'ending_aura')  { set({ screen: 'ending', endingType: 'aura' }); return; }
    if (nodeId === 'ending_nexus') { set({ screen: 'ending', endingType: 'nexus' }); return; }
    const node = getNode(nodeId);
    if (!node) return;
    set({
      currentNodeId: nodeId,
      screen: node.type === 'combat' ? 'combat' : node.type,
      combat: node.type === 'combat' ? initCombat(node.enemies) : null,
    });
  },

  /* ── 전투 액션 ── */
  doCombatAttack() {
    const { combat, stats, equipment, ability, hp, maxHp } = get();
    const result = playerAttack(combat, stats, equipment, ability);
    get()._afterPlayerAction(result, hp, maxHp);
  },

  doCombatSkill(skillId) {
    const { combat, stats, equipment, ability, hp, maxHp, mp } = get();
    const result = playerSkill(combat, skillId, stats, equipment, ability, mp);
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
    const { combat, stats, equipment, ability, hp } = get();
    const { newCombat, hpDelta } = enemyTurn(combat, stats, equipment, ability, hp);
    const newHp = clampHp(hp + hpDelta);
    if (newCombat.phase === 'lose' || newHp <= 0) {
      set({ combat: newCombat, hp: 0, screen: 'gameover' });
      return;
    }
    set({ combat: newCombat, hp: newHp });
  },

  /* 전투 승리 처리 + 경험치/레벨업 */
  _handleCombatWin(newCombat, newHp, newMp, newInv) {
    const { currentNodeId, gold, level, totalExp, ability, stats, maxHp, maxMp } = get();
    const node = getNode(currentNodeId);
    const goldGain = node?.goldReward ?? 0;

    // 경험치: 쓰러진 적 합산
    const expGain = newCombat.enemies.reduce((sum, e) => sum + (e.expReward ?? 0), 0);
    const newTotalExp = totalExp + expGain;

    // 레벨업 체크 (연속 레벨업 허용)
    let newLevel = level;
    let newStats = { ...stats };
    let newMaxHp = maxHp;
    let newMaxMp = maxMp;
    let gains = null;

    while (newLevel < EXP_TABLE.length && newTotalExp >= expForLevel(newLevel)) {
      newLevel++;
      const g = LEVEL_UP_GAINS[ability] ?? { power: 2, control: 2, mental: 2, maxHp: 15, maxMp: 10 };
      newStats = applyStatChanges(newStats, { power: g.power, control: g.control, mental: g.mental });
      newMaxHp += g.maxHp;
      newMaxMp += g.maxMp;
      gains = g; // 마지막 레벨업 gains
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
      // 레벨업 화면 먼저 보여주고 이후 다음 노드로
      set({ screen: 'levelup' });
    } else {
      const nextId = node?.onWin;
      if (nextId) get().goToNode(nextId);
    }
  },

  /* 레벨업 화면에서 확인 후 다음 노드 이동 */
  confirmLevelUp() {
    const node = getNode(get().currentNodeId);
    const nextId = node?.onWin;
    set({ levelUpGains: null });
    if (nextId) get().goToNode(nextId);
  },

  /* ── 상점 ── */
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

  /* ── 휴식 ── */
  doRest() {
    const node = getNode(get().currentNodeId);
    if (!node?.restAmount) return;
    const { hp, maxHp, mp, maxMp } = get();
    const newHp = Math.min(maxHp, clampHp(hp + (node.restAmount.hp ?? 0)));
    const newMp = Math.min(maxMp, clampMp(mp + (node.restAmount.mp ?? 0)));
    set({ hp: newHp, mp: newMp });
    if (node.next) get().goToNode(node.next);
  },

  /* ── 리셋 ── */
  resetGame() {
    set({
      screen: 'title',
      playerName: '', ability: null,
      stats: { power: 0, control: 0, mental: 0 },
      hp: 0, maxHp: 0, mp: 0, maxMp: 0,
      gold: 0,
      level: 1, totalExp: 0, expGainedLast: 0, levelUpGains: null,
      currentNodeId: 'ch1_s0',
      faction: 0, relations: { ...INITIAL_RELATIONS },
      skills: [], inventory: [], equipment: {},
      combat: null, endingType: null,
    });
  },
}));
