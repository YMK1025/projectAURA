import { create } from 'zustand';
import { ABILITIES } from '../data/abilities.js';
import { ABILITY_SKILLS } from '../data/skills.js';
import { getNode } from '../data/chapters/index.js';
import { SHOP_INVENTORIES } from '../data/items.js';
import {
  initCombat, playerAttack, playerSkill,
  playerDefend, useItemInCombat, enemyTurn,
} from '../engine/combat.js';
import { clampHp, clampMp, clampStat, STAT_MAX } from '../engine/stats.js';

const INITIAL_RELATIONS = { jiyu: 0, kai: 0 };

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

export const useGameStore = create((set, get) => ({
  /* ── 화면 ── */
  screen: 'title', // title | awakening | story | combat | shop | rest | event | ending | gameover

  /* ── 플레이어 기본 ── */
  playerName: '',
  ability: null,      // 'telekinesis' | 'clairvoyance' | 'mind_control' | 'regeneration'
  stats: { power: 0, control: 0, mental: 0 },
  hp: 0,
  maxHp: 0,
  mp: 0,
  maxMp: 0,
  gold: 0,

  /* ── 진행 ── */
  currentNodeId: 'ch1_s0',
  faction: 0,         // -100(Nexus) ↔ +100(AURA)
  relations: { ...INITIAL_RELATIONS },
  skills: [],         // 보유 스킬 id 배열
  inventory: [],      // { ...item, qty }[]
  equipment: {},      // { armor, accessory }

  /* ── 전투 ── */
  combat: null,
  pendingNodeId: null,  // 전투 승리 후 이동할 노드

  /* ── 엔딩 ── */
  endingType: null, // 'aura' | 'nexus'

  /* ─────────────────────────────────────── */
  /* ACTIONS                                  */
  /* ─────────────────────────────────────── */

  setPlayerName: (name) => set({ playerName: name }),

  chooseAbility(abilityId) {
    const ab = ABILITIES[abilityId];
    set({
      ability: abilityId,
      stats: { ...ab.initStats },
      hp: ab.initHp,
      maxHp: ab.initHp,
      mp: ab.initMp,
      maxMp: ab.initMp,
      skills: [...ABILITY_SKILLS[abilityId]],
      screen: 'story',
      currentNodeId: 'ch1_s0',
      faction: 0,
      relations: { ...INITIAL_RELATIONS },
      inventory: [],
      equipment: {},
      gold: 0,
    });
  },

  /* 스토리 / 이벤트 선택지 처리 */
  makeChoice(choice) {
    const { stats, relations, faction, hp, maxHp, mp, maxMp } = get();

    const newStats    = applyStatChanges(stats, choice.statChanges);
    const newRelation = applyRelationChanges(relations, choice.relation ?? {});
    const newFaction  = Math.max(-100, Math.min(100, faction + (choice.faction ?? 0)));
    const newHp       = clampHp(hp);
    const newMp       = clampMp(mp);

    const nextNode = getNode(choice.next);
    if (!nextNode) return;

    set({
      stats: newStats,
      relations: newRelation,
      faction: newFaction,
      hp: newHp,
      mp: newMp,
      currentNodeId: choice.next,
      screen: nextNode.type === 'combat' ? 'combat' : nextNode.type,
      combat: nextNode.type === 'combat'
        ? initCombat(nextNode.enemies)
        : null,
    });
  },

  /* 스토리/이벤트 → 다음 (선택지 없는 이동) */
  goToNode(nodeId) {
    const node = getNode(nodeId);
    if (!node) return;
    if (nodeId === 'gameover') {
      set({ screen: 'gameover' });
      return;
    }
    if (nodeId === 'ending_aura') {
      set({ screen: 'ending', endingType: 'aura' });
      return;
    }
    if (nodeId === 'ending_nexus') {
      set({ screen: 'ending', endingType: 'nexus' });
      return;
    }
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
    const newInv = inventory.map((it, i) =>
      i === idx ? { ...it, qty: it.qty - 1 } : it
    ).filter(it => it.qty > 0);
    const newHp = clampHp(hp + hpDelta);
    const newMp = clampMp(mp + mpDelta);
    get()._afterPlayerAction(newCombat, newHp, maxHp, newMp, newInv);
  },

  /* 플레이어 행동 후 공통 처리 */
  _afterPlayerAction(newCombat, newHp, maxHp, newMp, newInv) {
    const { mp, inventory } = get();
    const usedMp  = newMp  !== undefined ? newMp  : mp;
    const usedInv = newInv !== undefined ? newInv : inventory;

    if (newCombat.phase === 'win') {
      get()._handleCombatWin(newCombat, newHp, usedMp, usedInv);
      return;
    }

    set({ combat: newCombat, hp: newHp, mp: usedMp, inventory: usedInv });

    if (newCombat.phase === 'enemy') {
      get().doEnemyTurn();
    }
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

  _handleCombatWin(newCombat, newHp, newMp, newInv) {
    const node = getNode(get().currentNodeId);
    const goldGain = node?.goldReward ?? 0;
    const newGold  = get().gold + goldGain;
    const nextId   = node?.onWin;

    set({ combat: null, hp: newHp, mp: newMp, inventory: newInv, gold: newGold });

    if (nextId) get().goToNode(nextId);
  },

  /* ── 상점 ── */
  buyItem(item) {
    const { gold, inventory } = get();
    if (gold < item.price) return;
    const idx = inventory.findIndex(i => i.id === item.id);
    let newInv;
    if (idx >= 0) {
      newInv = inventory.map((it, i) => i === idx ? { ...it, qty: it.qty + 1 } : it);
    } else {
      newInv = [...inventory, { ...item, qty: 1 }];
    }
    set({ gold: gold - item.price, inventory: newInv });
  },

  equipItem(item) {
    const { equipment, inventory } = get();
    const slot = item.slot; // 'armor' | 'accessory'
    if (!slot) return;
    const newEquip = { ...equipment, [slot]: item };
    const newInv = inventory.map(it =>
      it.id === item.id ? { ...it, qty: it.qty - 1 } : it
    ).filter(it => it.qty > 0);
    set({ equipment: newEquip, inventory: newInv });
  },

  /* ── 휴식 ── */
  doRest() {
    const node = getNode(get().currentNodeId);
    if (!node?.restAmount) return;
    const { hp, maxHp, mp, maxMp } = get();
    const newHp = clampHp(hp + (node.restAmount.hp ?? 0));
    const newMp = clampMp(mp + (node.restAmount.mp ?? 0));
    set({ hp: newHp, mp: newMp });
    if (node.next) get().goToNode(node.next);
  },

  /* ── 리셋 ── */
  resetGame() {
    set({
      screen: 'title',
      playerName: '',
      ability: null,
      stats: { power: 0, control: 0, mental: 0 },
      hp: 0, maxHp: 0, mp: 0, maxMp: 0,
      gold: 0,
      currentNodeId: 'ch1_s0',
      faction: 0,
      relations: { ...INITIAL_RELATIONS },
      skills: [],
      inventory: [],
      equipment: {},
      combat: null,
      pendingNodeId: null,
      endingType: null,
    });
  },
}));
