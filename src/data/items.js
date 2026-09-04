/* 아이템 정의
   type: 'consumable' | 'equipment'
   slot: (equipment) 'armor' | 'accessory'
   grade: 'common' | 'rare' | 'epic' | 'legendary'
*/
export const ITEMS = {
  /* ── 소비 아이템 — Common ─── */
  recovery_s: {
    id: 'recovery_s', name: '소형 회복제', emoji: '🧪',
    desc: 'HP를 200 회복한다.',
    type: 'consumable', grade: 'common', price: 80,
    effect: { hp: 200 },
  },
  charge_pack: {
    id: 'charge_pack', name: '충전 팩', emoji: '🔌',
    desc: '모든 스킬 횟수를 +2 회복한다.',
    type: 'consumable', grade: 'common', price: 120,
    effect: { charges: 2 },
  },
  antidote: {
    id: 'antidote', name: '해독제', emoji: '🫙',
    desc: '상태이상을 모두 해제한다.',
    type: 'consumable', grade: 'common', price: 120,
    effect: { cleanse: true },
  },
  stimulant: {
    id: 'stimulant', name: '자극제', emoji: '💉',
    desc: 'HP를 50 회복한다.',
    type: 'consumable', grade: 'common', price: 60,
    effect: { hp: 50 },
  },
  protein_bar: {
    id: 'protein_bar', name: '전투 식량', emoji: '🍫',
    desc: '파워 +1 영구 상승.',
    type: 'consumable', grade: 'common', price: 50,
    effect: { stat: 'power', amount: 1 },
  },
  nerve_tonic: {
    id: 'nerve_tonic', name: '신경 강화제', emoji: '🧬',
    desc: '제어 +1 영구 상승.',
    type: 'consumable', grade: 'common', price: 70,
    effect: { stat: 'control', amount: 1 },
  },

  /* ── 소비 아이템 — Rare ─── */
  recovery_l: {
    id: 'recovery_l', name: '대형 회복제', emoji: '💊',
    desc: 'HP를 150 회복한다.',
    type: 'consumable', grade: 'rare', price: 200,
    effect: { hp: 150 },
  },
  energy_drink: {
    id: 'energy_drink', name: '에너지 드링크', emoji: '⚡',
    desc: 'HP +80 회복 및 스킬 전체 횟수 +1 회복.',
    type: 'consumable', grade: 'rare', price: 150,
    effect: { hp: 80, charges: 1 },
  },
  adrenaline: {
    id: 'adrenaline', name: '아드레날린', emoji: '💊',
    desc: '최대 HP +20 영구 증가.',
    type: 'consumable', grade: 'rare', price: 200,
    effect: { maxHpBonus: 20 },
  },
  focus_crystal: {
    id: 'focus_crystal', name: '집중 결정체', emoji: '💠',
    desc: '첫 번째 스킬의 최대 횟수 +1 영구.',
    type: 'consumable', grade: 'rare', price: 180,
    effect: { chargeBonus: 1 },
  },
  tactical_grenade: {
    id: 'tactical_grenade', name: '전술 수류탄', emoji: '💣',
    desc: '전투 중 전체 적에게 40 고정 피해.',
    type: 'consumable', grade: 'rare', price: 160,
    effect: { combatDmg: 40, target: 'all' },
  },

  /* ── 소비 아이템 — Epic ─── */
  awakening_ampoule: {
    id: 'awakening_ampoule', name: '각성 앰플', emoji: '✨',
    desc: '파워/제어/정신 중 하나를 +8 영구 상승.',
    type: 'consumable', grade: 'epic', price: 350,
    effect: { chooseStat: true, amount: 8 },
  },
  skill_crystal: {
    id: 'skill_crystal', name: '스킬 결정체', emoji: '💎',
    desc: '보유 스킬 중 레벨이 가장 낮은 스킬의 레벨을 +1 올린다. (최대 Lv3)',
    type: 'consumable', grade: 'epic', price: 300,
    effect: { upgradeSkill: true },
  },
  power_core: {
    id: 'power_core', name: '파워 코어', emoji: '🔋',
    desc: '파워/정신/제어 중 선택하여 +4 영구 상승.',
    type: 'consumable', grade: 'epic', price: 350,
    effect: { chooseStat: true, amount: 4 },
  },
  neural_booster: {
    id: 'neural_booster', name: '신경 부스터', emoji: '🧠',
    desc: '장착 시 모든 스킬 최대 횟수 +1 영구.',
    type: 'consumable', grade: 'epic', price: 500,
    effect: { allChargeBonus: 1 },
  },

  /* ── 소비 아이템 — Legendary ─── */
  ancient_serum: {
    id: 'ancient_serum', name: '고대 혈청', emoji: '🩸',
    desc: '최대 HP +50 영구 증가, 모든 스킬 횟수 완전 회복.',
    type: 'consumable', grade: 'legendary', price: 600,
    effect: { maxHpBonus: 50, fullChargeRestore: true },
  },

  /* ── 장비 아이템 — Rare ─── */
  aura_vest: {
    id: 'aura_vest', name: 'AURA 방탄복', emoji: '🦺',
    desc: '방어력 +35. AURA 진영 전용 장비.',
    type: 'equipment', grade: 'rare', slot: 'armor', price: 400,
    factionReq: 'aura',
    effect: { defense: 35 },
  },
  reinforced_suit: {
    id: 'reinforced_suit', name: '강화 수트', emoji: '🥷',
    desc: '방어력 +20. 진영 무관.',
    type: 'equipment', grade: 'rare', slot: 'armor', price: 250,
    effect: { defense: 20 },
  },
  focus_band: {
    id: 'focus_band', name: '집중력 밴드', emoji: '🎯',
    desc: '장착 시 제어 +5 영구.',
    type: 'equipment', grade: 'rare', slot: 'accessory', price: 280,
    effect: { statBonus: { control: 5 } },
  },

  /* ── 장비 아이템 — Epic ─── */
  nexus_chip: {
    id: 'nexus_chip', name: 'Nexus 개조 칩', emoji: '💾',
    desc: '스킬 최대 횟수 +1 영구. Nexus 진영 전용.',
    type: 'equipment', grade: 'epic', slot: 'accessory', price: 450,
    factionReq: 'nexus',
    effect: { chargeMult: 1 },
  },
  phase_blade: {
    id: 'phase_blade', name: '위상 검', emoji: '⚔️',
    desc: '장착 시 일반 공격력 +25%.',
    type: 'equipment', grade: 'epic', slot: 'accessory', price: 400,
    effect: { atkMult: 1.25 },
  },

  /* ── 장비 아이템 — Legendary ─── */
  overdrive_core: {
    id: 'overdrive_core', name: '오버드라이브 코어', emoji: '⚡',
    desc: '장착 시 파워+5, 정신+5, 제어+5 영구.',
    type: 'equipment', grade: 'legendary', slot: 'accessory', price: 800,
    effect: { statBonus: { power: 5, mental: 5, control: 5 } },
  },
};

/* 상점별 판매 목록 */
export const SHOP_INVENTORIES = {
  aura_supply:  [
    'recovery_s', 'charge_pack', 'energy_drink', 'stimulant',
    'skill_crystal', 'aura_vest', 'reinforced_suit', 'focus_band',
  ],
  black_market: [
    'recovery_l', 'awakening_ampoule', 'antidote', 'skill_crystal',
    'power_core', 'nexus_chip', 'phase_blade', 'tactical_grenade',
  ],
  general: [
    'recovery_s', 'recovery_l', 'charge_pack', 'energy_drink',
    'antidote', 'nerve_tonic', 'protein_bar', 'adrenaline',
    'skill_crystal', 'reinforced_suit',
  ],
};
