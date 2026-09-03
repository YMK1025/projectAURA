/* ─── 스킬 정의 (레벨 1-3 시스템)
   levels 배열: 인덱스 0 = Lv1, 1 = Lv2, 2 = Lv3
   getSkillAtLevel(skill, lv) 로 유효 속성 추출
─── */

/* ═══════════════════════════════════════
   물리계 스킬
═══════════════════════════════════════ */
export const SKILLS = {

  /* ── 물리계 공통 ── */
  smash: {
    id: 'smash', name: '스매시', emoji: '💪',
    lineage: 'physical', type: 'damage', target: 'enemy', statScale: 'power',
    levels: [
      { mpCost: 20, multiplier: 1.8, desc: '전신의 힘을 실어 강타한다.' },
      { mpCost: 25, multiplier: 2.3, desc: '더 큰 충격. 적이 휘청인다.' },
      { mpCost: 30, multiplier: 3.0, desc: '극한의 일격. 대지를 가른다.' },
      { mpCost: 45, multiplier: 4.5, awakeningDesc: '파괴의 심판', desc: '모든 것을 부수는 단 한 번의 일격.' },
    ],
  },

  /* ── 수호자 전용 ── */
  iron_wall: {
    id: 'iron_wall', name: '철벽', emoji: '🛡',
    lineage: 'physical', type: 'buff', target: 'self',
    levels: [
      { mpCost: 25, effect: { type: 'defended', duration: 1, mult: 0.5 }, desc: '강철 방어막. 1턴간 피해 50% 감소.' },
      { mpCost: 30, effect: { type: 'defended', duration: 2, mult: 0.5 }, desc: '2턴간 피해 50% 감소.' },
      { mpCost: 35, effect: { type: 'defended', duration: 2, mult: 0.5 }, comboEffect: { type: 'overdrive', duration: 1, atkMult: 1.5, statBonus: 0 }, desc: '2턴 방어 + 반격 준비 (다음 공격 1.5×).' },
      { mpCost: 50, effect: { type: 'defended', duration: 3, mult: 0.4 }, comboEffect: { type: 'overdrive', duration: 1, atkMult: 2.0, statBonus: 0 }, healAmount: 150, awakeningDesc: '불패의 요새', desc: '3턴 피해 60% 감소 + 반격(×2.0) + HP+150.' },
    ],
  },

  /* ── 야수술사 전용 ── */
  feral_rush: {
    id: 'feral_rush', name: '맹습', emoji: '🐺',
    lineage: 'physical', type: 'damage', target: 'enemy', statScale: 'power',
    levels: [
      { mpCost: 30, multiplier: 1.6, lifesteal: 0.3, desc: '야수처럼 달려들며 피를 흡수. 피해 30% HP 회복.' },
      { mpCost: 35, multiplier: 2.0, lifesteal: 0.4, desc: '더 빠르고 강한 돌진. 피해 40% HP 회복.' },
      { mpCost: 40, multiplier: 2.5, lifesteal: 0.5, bleedEffect: { damage: 25, duration: 2 }, desc: '극한의 야수 해방. 피해 50% 흡혈 + 출혈.' },
      { mpCost: 60, multiplier: 3.5, lifesteal: 0.7, bleedEffect: { damage: 40, duration: 3 }, awakeningDesc: '야수 해방', desc: '야수의 본능 완전 해방. 흡혈 70% + 출혈 40/공격×3턴.' },
    ],
  },

  /* ── 물리계 챕터2 획득 ── */
  war_cry: {
    id: 'war_cry', name: '전투 함성', emoji: '📢',
    lineage: 'physical', type: 'debuff', target: 'enemy',
    levels: [
      { mpCost: 20, effect: { type: 'fear', duration: 2, atkMult: 0.7 }, desc: '포효로 적의 의지를 꺾어 2턴간 공격력 30% 감소.' },
      { mpCost: 25, effect: { type: 'fear', duration: 2, atkMult: 0.6 }, desc: '더 강력한 함성. 2턴간 공격력 40% 감소.' },
      { mpCost: 30, effect: { type: 'fear', duration: 3, atkMult: 0.6 }, desc: '전장을 압도하는 함성. 3턴간 공격력 40% 감소.' },
      { mpCost: 45, effect: { type: 'fear', duration: 4, atkMult: 0.5 }, awakeningDesc: '전장의 지배자', desc: '전장을 지배하는 함성. 4턴간 공격력 50% 감소.' },
    ],
  },

  /* ── 물리계 챕터3 획득 ── */
  body_slam: {
    id: 'body_slam', name: '바디슬램', emoji: '💥',
    lineage: 'physical', type: 'damage', target: 'all_enemies', statScale: 'power',
    levels: [
      { mpCost: 35, multiplier: 1.4, desc: '전체 적에게 몸으로 돌진한다.' },
      { mpCost: 40, multiplier: 1.8, desc: '더 강렬한 충격파로 전체를 강타.' },
      { mpCost: 45, multiplier: 2.2, desc: '폭발적인 충격으로 전체를 쓸어버린다.' },
      { mpCost: 60, multiplier: 2.8, bleedEffect: { damage: 35, duration: 2 }, awakeningDesc: '지진격', desc: '대지를 가르는 충격. 전체 강타 + 출혈 35/공격×2턴.' },
    ],
  },

/* ═══════════════════════════════════════
   정신계 스킬
═══════════════════════════════════════ */

  /* ── 정신계 공통 ── */
  tele_strike: {
    id: 'tele_strike', name: '염동 충격', emoji: '🌀',
    lineage: 'psychic', type: 'damage', target: 'enemy', statScale: 'mental',
    levels: [
      { mpCost: 25, multiplier: 1.8, desc: '정신력을 응집해 적을 강타한다.' },
      { mpCost: 30, multiplier: 2.3, desc: '강화된 정신 충격파.' },
      { mpCost: 38, multiplier: 3.0, desc: '초월적 염동력의 극한 일격.' },
      { mpCost: 55, multiplier: 2.5, target: 'all_enemies', awakeningDesc: '정신의 붕괴', desc: '정신파를 폭발시켜 모든 적에게 동시 충격.' },
    ],
  },

  /* ── 투시자 전용 ── */
  fate_distort: {
    id: 'fate_distort', name: '운명 왜곡', emoji: '✨',
    lineage: 'psychic', type: 'buff', target: 'self',
    levels: [
      { mpCost: 30, effect: { type: 'dodge_next', duration: 1 }, desc: '미래를 읽어 다음 공격을 확정 회피.' },
      { mpCost: 35, effect: { type: 'dodge_next', duration: 1 }, secondEffect: { type: 'exposed', duration: 2, damageUp: 0.25 }, desc: '회피 + 적 약점 노출 (피해 +25%, 2턴).' },
      { mpCost: 45, effect: { type: 'dodge_next', duration: 1 }, extraTurn: true, desc: '회피 + 추가 행동 획득.' },
      { mpCost: 60, effect: { type: 'dodge_next', duration: 1 }, extraTurn: true, secondEffect: { type: 'exposed', duration: 3, damageUp: 0.5 }, awakeningDesc: '시간의 지배자', desc: '확정 회피 + 추가 행동 + 적 피해 +50%(3턴).' },
    ],
  },

  /* ── 지배자 전용 ── */
  full_domination: {
    id: 'full_domination', name: '완전 지배', emoji: '🧠',
    lineage: 'psychic', type: 'special', target: 'enemy',
    levels: [
      { mpCost: 50, dominateMult: 0.8, desc: '적의 의식을 장악해 자해하게 만든다 (ATK × 0.8).' },
      { mpCost: 60, dominateMult: 1.0, followEffect: { type: 'stun', duration: 1 }, desc: '자해 (ATK × 1.0) + 1턴 행동 불능.' },
      { mpCost: 70, dominateMult: 1.2, followEffect: { type: 'fear', duration: 2, atkMult: 0.65 }, desc: '자해 (ATK × 1.2) + 2턴 공포.' },
      { mpCost: 90, dominateMult: 2.0, followEffect: { type: 'fear', duration: 3, atkMult: 0.5 }, awakeningDesc: '완전 소멸', desc: '자해 (ATK × 2.0) + 3턴 공포(공격력 50% 감소).' },
    ],
  },

  /* ── 정신계 챕터2 획득 ── */
  psychic_scan: {
    id: 'psychic_scan', name: '정신 분석', emoji: '🔍',
    lineage: 'psychic', type: 'debuff', target: 'enemy',
    levels: [
      { mpCost: 20, effect: { type: 'exposed', duration: 2, damageUp: 0.25 }, desc: '적의 약점을 간파해 2턴간 받는 피해 +25%.' },
      { mpCost: 25, effect: { type: 'exposed', duration: 2, damageUp: 0.35 }, desc: '더 깊은 분석. 2턴간 +35%.' },
      { mpCost: 30, effect: { type: 'exposed', duration: 3, damageUp: 0.35 }, desc: '완전한 분석. 3턴간 +35%.' },
      { mpCost: 40, effect: { type: 'exposed', duration: 4, damageUp: 0.5 }, awakeningDesc: '정신 붕괴', desc: '완전한 약점 분석. 4턴간 받는 피해 +50%.' },
    ],
  },

  /* ── 정신계 챕터3 획득 ── */
  mind_blast: {
    id: 'mind_blast', name: '정신 폭발', emoji: '💫',
    lineage: 'psychic', type: 'damage', target: 'all_enemies', statScale: 'mental',
    levels: [
      { mpCost: 40, multiplier: 1.4, desc: '정신파를 폭발시켜 전체 적을 강타.' },
      { mpCost: 45, multiplier: 1.8, desc: '더 강력한 정신 폭발.' },
      { mpCost: 55, multiplier: 2.3, desc: '전장을 뒤덮는 초월적 정신 폭발.' },
      { mpCost: 75, multiplier: 3.0, awakeningDesc: '정신 대폭발', desc: '극한의 정신 폭발. 전체 적에게 초월적 피해.' },
    ],
  },

/* ═══════════════════════════════════════
   자연계 스킬
═══════════════════════════════════════ */

  /* ── 자연계 공통 ── */
  element_burst: {
    id: 'element_burst', name: '원소 폭발', emoji: '🌊',
    lineage: 'nature', type: 'damage', target: 'enemy', statScale: 'mental',
    levels: [
      { mpCost: 22, multiplier: 1.6, desc: '자연 원소를 응집해 폭발시킨다.' },
      { mpCost: 28, multiplier: 2.0, desc: '더 강렬한 원소의 폭발.' },
      { mpCost: 35, multiplier: 2.6, desc: '자연의 분노가 응집된 극한 폭발.' },
      { mpCost: 55, multiplier: 2.0, target: 'all_enemies', awakeningDesc: '원소 해방', desc: '원소를 해방해 전체 적에게 폭발.' },
    ],
  },

  /* ── 화염술사 전용 ── */
  conflagration: {
    id: 'conflagration', name: '업화', emoji: '🔥',
    lineage: 'nature', type: 'damage', target: 'enemy', statScale: 'mental',
    levels: [
      { mpCost: 40, multiplier: 2.0, burnEffect: { damage: 25, duration: 2 }, desc: '강렬한 불꽃 + 화상 25/턴 × 2턴.' },
      { mpCost: 50, multiplier: 2.5, burnEffect: { damage: 35, duration: 3 }, desc: '더 맹렬한 화염 + 화상 35/턴 × 3턴.' },
      { mpCost: 60, multiplier: 3.0, burnEffect: { damage: 50, duration: 3 }, desc: '업화 극한 해방 + 화상 50/턴 × 3턴.' },
      { mpCost: 80, multiplier: 4.5, burnEffect: { damage: 80, duration: 4 }, awakeningDesc: '업화 폭주', desc: '한계를 초월한 업화. 화상 80/턴 × 4턴.' },
    ],
  },

  /* ── 뇌격사 전용 ── */
  thunder_storm: {
    id: 'thunder_storm', name: '뇌폭풍', emoji: '⚡',
    lineage: 'nature', type: 'damage', target: 'all_enemies', statScale: 'power',
    levels: [
      { mpCost: 40, multiplier: 0.8, hits: 2, desc: '번개 2연격으로 전체 적 강타.' },
      { mpCost: 50, multiplier: 0.9, hits: 3, desc: '3연격 번개 폭풍.' },
      { mpCost: 60, multiplier: 1.0, hits: 4, desc: '4연격 대뇌폭풍. 전장을 초토화.' },
      { mpCost: 85, multiplier: 1.2, hits: 5, awakeningDesc: '대폭풍', desc: '5연격 대폭풍(총 ×6.0). 전장을 소멸시킨다.' },
    ],
  },

  /* ── 자연계 챕터2 획득 ── */
  stone_wall: {
    id: 'stone_wall', name: '석벽', emoji: '🪨',
    lineage: 'nature', type: 'buff', target: 'self',
    levels: [
      { mpCost: 25, effect: { type: 'defended', duration: 1, mult: 0.6 }, desc: '1턴간 피해 40% 감소.' },
      { mpCost: 30, effect: { type: 'defended', duration: 1, mult: 0.55 }, healAmount: 50, desc: '피해 45% 감소 + HP +50 회복.' },
      { mpCost: 35, effect: { type: 'defended', duration: 2, mult: 0.5 }, healAmount: 80, desc: '2턴 피해 50% 감소 + HP +80 회복.' },
      { mpCost: 55, effect: { type: 'defended', duration: 3, mult: 0.5 }, healAmount: 200, awakeningDesc: '대지의 수호', desc: '3턴 피해 50% 감소 + HP +200 회복.' },
    ],
  },

  /* ── 자연계 챕터3 획득 ── */
  nature_wrath: {
    id: 'nature_wrath', name: '자연의 분노', emoji: '🌿',
    lineage: 'nature', type: 'damage', target: 'all_enemies', statScale: 'mental',
    levels: [
      { mpCost: 45, multiplier: 1.2, burnEffect: { damage: 15, duration: 1 }, desc: '전체 공격 + 화상 15/턴 × 1턴.' },
      { mpCost: 55, multiplier: 1.5, burnEffect: { damage: 20, duration: 2 }, desc: '전체 공격 + 화상 20/턴 × 2턴.' },
      { mpCost: 65, multiplier: 1.8, burnEffect: { damage: 30, duration: 2 }, desc: '강렬한 전체 공격 + 화상 30/턴 × 2턴.' },
      { mpCost: 80, multiplier: 2.5, poisonEffect: { damage: 25, stackDamage: 10, duration: 3 }, awakeningDesc: '자연의 심판', desc: '전체 강타 + 독(25→35→45/턴×3턴).' },
    ],
  },
};

/* 스킬에 레벨 속성 병합 (Lv4=각성 지원) */
export function getSkillAtLevel(skill, level = 1) {
  const maxLv = skill.levels?.length ?? 3;
  const lv = Math.max(1, Math.min(maxLv, level));
  const lvData = skill.levels?.[lv - 1] ?? {};
  return { ...skill, ...lvData };
}
