/* 아이템 정의
   type: 'consumable' | 'equipment'
   slot: (equipment) 'armor' | 'accessory'
*/
export const ITEMS = {
  /* ── 소비 아이템 ─── */
  recovery_s: {
    id: 'recovery_s', name: '소형 회복제', emoji: '🧪',
    desc: 'HP를 200 회복한다.',
    type: 'consumable', price: 80,
    effect: { hp: 200 },
  },
  recovery_l: {
    id: 'recovery_l', name: '대형 회복제', emoji: '💉',
    desc: 'HP를 500 회복한다.',
    type: 'consumable', price: 200,
    effect: { hp: 500 },
  },
  stabilizer: {
    id: 'stabilizer', name: '정신안정제', emoji: '💊',
    desc: 'MP를 180 회복한다.',
    type: 'consumable', price: 100,
    effect: { mp: 180 },
  },
  energy_drink: {
    id: 'energy_drink', name: '에너지 드링크', emoji: '⚡',
    desc: 'HP 120, MP 120 동시 회복.',
    type: 'consumable', price: 150,
    effect: { hp: 120, mp: 120 },
  },
  awakening_ampoule: {
    id: 'awakening_ampoule', name: '각성 앰플', emoji: '✨',
    desc: '파워/컨트롤/멘탈 중 하나를 +8 영구 상승.',
    type: 'consumable', price: 350,
    effect: { chooseStat: true, amount: 8 },
  },
  antidote: {
    id: 'antidote', name: '해독제', emoji: '🫙',
    desc: '상태이상을 모두 해제한다.',
    type: 'consumable', price: 120,
    effect: { cleanse: true },
  },

  /* ── 스킬 결정체 ─── */
  skill_crystal: {
    id: 'skill_crystal', name: '스킬 결정체', emoji: '💎',
    desc: '보유 스킬 중 레벨이 가장 낮은 스킬의 레벨을 +1 올린다. (최대 Lv3)',
    type: 'consumable', price: 300,
    effect: { upgradeSkill: true },
  },

  /* ── 장비 아이템 ─── */
  aura_vest: {
    id: 'aura_vest', name: 'AURA 방탄복', emoji: '🦺',
    desc: '방어력 +35. AURA 진영 전용 장비.',
    type: 'equipment', slot: 'armor', price: 400,
    factionReq: 'aura',
    effect: { defense: 35 },
  },
  nexus_chip: {
    id: 'nexus_chip', name: 'Nexus 개조 칩', emoji: '💾',
    desc: '스킬 MP 비용 -25%. Nexus 진영 전용.',
    type: 'equipment', slot: 'accessory', price: 450,
    factionReq: 'nexus',
    effect: { mpCostMult: 0.75 },
  },
  reinforced_suit: {
    id: 'reinforced_suit', name: '강화 수트', emoji: '🥷',
    desc: '방어력 +20. 진영 무관.',
    type: 'equipment', slot: 'armor', price: 250,
    effect: { defense: 20 },
  },
  focus_band: {
    id: 'focus_band', name: '집중력 밴드', emoji: '🎯',
    desc: 'MP 최대치 +80. 진영 무관.',
    type: 'equipment', slot: 'accessory', price: 280,
    effect: { maxMpBonus: 80 },
  },
};

/* 상점별 판매 목록 */
export const SHOP_INVENTORIES = {
  aura_supply:  ['recovery_s', 'stabilizer', 'energy_drink', 'skill_crystal', 'aura_vest', 'reinforced_suit'],
  black_market: ['recovery_l', 'stabilizer', 'awakening_ampoule', 'antidote', 'skill_crystal', 'nexus_chip', 'focus_band'],
  general:      ['recovery_s', 'recovery_l', 'stabilizer', 'energy_drink', 'antidote', 'skill_crystal', 'reinforced_suit'],
};
