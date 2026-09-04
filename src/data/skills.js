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
    lineage: 'physical', type: 'damage', slotType: 'attack', target: 'enemy', statScale: 'power', element: 'physical',
    maxCharges: 3,
    levels: [
      { multiplier: 1.8, desc: '전신의 힘을 실어 강타한다.' },
      { multiplier: 2.3, desc: '더 큰 충격. 적이 휘청인다.' },
      { multiplier: 3.0, desc: '극한의 일격. 대지를 가른다.' },
      { multiplier: 4.5, awakeningDesc: '파괴의 심판', desc: '모든 것을 부수는 단 한 번의 일격.' },
    ],
  },

  /* ── 수호자 전용 ── */
  iron_wall: {
    id: 'iron_wall', name: '철벽', emoji: '🛡',
    lineage: 'physical', type: 'buff', slotType: 'defense', target: 'self', element: 'physical',
    maxCharges: 4,
    levels: [
      { effect: { type: 'defended', duration: 1, mult: 0.5 }, desc: '강철 방어막. 1턴간 피해 50% 감소.' },
      { effect: { type: 'defended', duration: 2, mult: 0.5 }, desc: '2턴간 피해 50% 감소.' },
      { effect: { type: 'defended', duration: 2, mult: 0.5 }, comboEffect: { type: 'overdrive', duration: 1, atkMult: 1.5, statBonus: 0 }, desc: '2턴 방어 + 반격 준비 (다음 공격 1.5×).' },
      { effect: { type: 'defended', duration: 3, mult: 0.4 }, comboEffect: { type: 'overdrive', duration: 1, atkMult: 2.0, statBonus: 0 }, healAmount: 150, awakeningDesc: '불패의 요새', desc: '3턴 피해 60% 감소 + 반격(×2.0) + HP+150.' },
    ],
  },

  /* ── 야수술사 전용 ── */
  feral_rush: {
    id: 'feral_rush', name: '맹습', emoji: '🐺',
    lineage: 'physical', type: 'damage', slotType: 'attack', target: 'enemy', statScale: 'power', element: 'physical',
    maxCharges: 3,
    levels: [
      { multiplier: 1.6, lifesteal: 0.3, desc: '야수처럼 달려들며 피를 흡수. 피해 30% HP 회복.' },
      { multiplier: 2.0, lifesteal: 0.4, desc: '더 빠르고 강한 돌진. 피해 40% HP 회복.' },
      { multiplier: 2.5, lifesteal: 0.5, bleedEffect: { damage: 25, duration: 2 }, desc: '극한의 야수 해방. 피해 50% 흡혈 + 출혈.' },
      { multiplier: 3.5, lifesteal: 0.7, bleedEffect: { damage: 40, duration: 3 }, awakeningDesc: '야수 해방', desc: '야수의 본능 완전 해방. 흡혈 70% + 출혈 40/공격×3턴.' },
    ],
  },

  /* ── 물리계 챕터2 획득 ── */
  war_cry: {
    id: 'war_cry', name: '전투 함성', emoji: '📢',
    lineage: 'physical', type: 'buff', slotType: 'special', target: 'enemy', element: 'physical',
    maxCharges: 3,
    levels: [
      { effect: { type: 'fear', duration: 2, atkMult: 0.7 }, desc: '포효로 적의 의지를 꺾어 2턴간 공격력 30% 감소.' },
      { effect: { type: 'fear', duration: 2, atkMult: 0.6 }, desc: '더 강력한 함성. 2턴간 공격력 40% 감소.' },
      { effect: { type: 'fear', duration: 3, atkMult: 0.6 }, desc: '전장을 압도하는 함성. 3턴간 공격력 40% 감소.' },
      { effect: { type: 'fear', duration: 4, atkMult: 0.5 }, awakeningDesc: '전장의 지배자', desc: '전장을 지배하는 함성. 4턴간 공격력 50% 감소.' },
    ],
  },

  /* ── 물리계 챕터3 획득 ── */
  body_slam: {
    id: 'body_slam', name: '바디슬램', emoji: '💥',
    lineage: 'physical', type: 'damage', slotType: 'attack', target: 'all_enemies', statScale: 'power', element: 'physical',
    maxCharges: 3,
    levels: [
      { multiplier: 1.4, desc: '전체 적에게 몸으로 돌진한다.' },
      { multiplier: 1.8, desc: '더 강렬한 충격파로 전체를 강타.' },
      { multiplier: 2.2, desc: '폭발적인 충격으로 전체를 쓸어버린다.' },
      { multiplier: 2.8, bleedEffect: { damage: 35, duration: 2 }, awakeningDesc: '지진격', desc: '대지를 가르는 충격. 전체 강타 + 출혈 35/공격×2턴.' },
    ],
  },

/* ═══════════════════════════════════════
   정신계 스킬
═══════════════════════════════════════ */

  /* ── 정신계 공통 ── */
  tele_strike: {
    id: 'tele_strike', name: '염동 충격', emoji: '🌀',
    lineage: 'psychic', type: 'damage', slotType: 'attack', target: 'enemy', statScale: 'mental', element: 'psychic',
    maxCharges: 3,
    levels: [
      { multiplier: 1.8, desc: '정신력을 응집해 적을 강타한다.' },
      { multiplier: 2.3, desc: '강화된 정신 충격파.' },
      { multiplier: 3.0, desc: '초월적 염동력의 극한 일격.' },
      { multiplier: 2.5, target: 'all_enemies', awakeningDesc: '정신의 붕괴', desc: '정신파를 폭발시켜 모든 적에게 동시 충격.' },
    ],
  },

  /* ── 투시자 전용 ── */
  fate_distort: {
    id: 'fate_distort', name: '운명 왜곡', emoji: '✨',
    lineage: 'psychic', type: 'buff', slotType: 'defense', target: 'self', element: 'psychic',
    maxCharges: 3,
    levels: [
      { effect: { type: 'dodge_next', duration: 1 }, desc: '미래를 읽어 다음 공격을 확정 회피.' },
      { effect: { type: 'dodge_next', duration: 1 }, secondEffect: { type: 'exposed', duration: 2, damageUp: 0.25 }, desc: '회피 + 적 약점 노출 (피해 +25%, 2턴).' },
      { effect: { type: 'dodge_next', duration: 1 }, extraTurn: true, desc: '회피 + 추가 행동 획득.' },
      { effect: { type: 'dodge_next', duration: 1 }, extraTurn: true, secondEffect: { type: 'exposed', duration: 3, damageUp: 0.5 }, awakeningDesc: '시간의 지배자', desc: '확정 회피 + 추가 행동 + 적 피해 +50%(3턴).' },
    ],
  },

  /* ── 지배자 전용 ── */
  full_domination: {
    id: 'full_domination', name: '완전 지배', emoji: '🧠',
    lineage: 'psychic', type: 'special', slotType: 'special', target: 'enemy', element: 'psychic',
    maxCharges: 2,
    levels: [
      { dominateMult: 0.8, desc: '적의 의식을 장악해 자해하게 만든다 (ATK × 0.8).' },
      { dominateMult: 1.0, followEffect: { type: 'stun', duration: 1 }, desc: '자해 (ATK × 1.0) + 1턴 행동 불능.' },
      { dominateMult: 1.2, followEffect: { type: 'fear', duration: 2, atkMult: 0.65 }, desc: '자해 (ATK × 1.2) + 2턴 공포.' },
      { dominateMult: 2.0, followEffect: { type: 'fear', duration: 3, atkMult: 0.5 }, awakeningDesc: '완전 소멸', desc: '자해 (ATK × 2.0) + 3턴 공포(공격력 50% 감소).' },
    ],
  },

  /* ── 정신계 챕터2 획득 ── */
  psychic_scan: {
    id: 'psychic_scan', name: '정신 분석', emoji: '🔍',
    lineage: 'psychic', type: 'debuff', slotType: 'special', target: 'enemy', element: 'psychic',
    maxCharges: 3,
    levels: [
      { effect: { type: 'exposed', duration: 2, damageUp: 0.25 }, desc: '적의 약점을 간파해 2턴간 받는 피해 +25%.' },
      { effect: { type: 'exposed', duration: 2, damageUp: 0.35 }, desc: '더 깊은 분석. 2턴간 +35%.' },
      { effect: { type: 'exposed', duration: 3, damageUp: 0.35 }, desc: '완전한 분석. 3턴간 +35%.' },
      { effect: { type: 'exposed', duration: 4, damageUp: 0.5 }, awakeningDesc: '정신 붕괴', desc: '완전한 약점 분석. 4턴간 받는 피해 +50%.' },
    ],
  },

  /* ── 정신계 챕터3 획득 ── */
  mind_blast: {
    id: 'mind_blast', name: '정신 폭발', emoji: '💫',
    lineage: 'psychic', type: 'damage', slotType: 'attack', target: 'all_enemies', statScale: 'mental', element: 'psychic',
    maxCharges: 3,
    levels: [
      { multiplier: 1.4, desc: '정신파를 폭발시켜 전체 적을 강타.' },
      { multiplier: 1.8, desc: '더 강력한 정신 폭발.' },
      { multiplier: 2.3, desc: '전장을 뒤덮는 초월적 정신 폭발.' },
      { multiplier: 3.0, awakeningDesc: '정신 대폭발', desc: '극한의 정신 폭발. 전체 적에게 초월적 피해.' },
    ],
  },

/* ═══════════════════════════════════════
   자연계 스킬
═══════════════════════════════════════ */

  /* ── 자연계 공통 ── */
  element_burst: {
    id: 'element_burst', name: '원소 폭발', emoji: '🌊',
    lineage: 'nature', type: 'damage', slotType: 'attack', target: 'enemy', statScale: 'mental', element: 'nature',
    maxCharges: 3,
    levels: [
      { multiplier: 1.6, desc: '자연 원소를 응집해 폭발시킨다.' },
      { multiplier: 2.0, desc: '더 강렬한 원소의 폭발.' },
      { multiplier: 2.6, desc: '자연의 분노가 응집된 극한 폭발.' },
      { multiplier: 2.0, target: 'all_enemies', awakeningDesc: '원소 해방', desc: '원소를 해방해 전체 적에게 폭발.' },
    ],
  },

  /* ── 화염술사 전용 ── */
  conflagration: {
    id: 'conflagration', name: '업화', emoji: '🔥',
    lineage: 'nature', type: 'damage', slotType: 'attack', target: 'enemy', statScale: 'mental', element: 'nature',
    maxCharges: 3,
    levels: [
      { multiplier: 2.0, burnEffect: { damage: 25, duration: 2 }, desc: '강렬한 불꽃 + 화상 25/턴 × 2턴.' },
      { multiplier: 2.5, burnEffect: { damage: 35, duration: 3 }, desc: '더 맹렬한 화염 + 화상 35/턴 × 3턴.' },
      { multiplier: 3.0, burnEffect: { damage: 50, duration: 3 }, desc: '업화 극한 해방 + 화상 50/턴 × 3턴.' },
      { multiplier: 4.5, burnEffect: { damage: 80, duration: 4 }, awakeningDesc: '업화 폭주', desc: '한계를 초월한 업화. 화상 80/턴 × 4턴.' },
    ],
  },

  /* ── 뇌격사 전용 ── */
  thunder_storm: {
    id: 'thunder_storm', name: '뇌폭풍', emoji: '⚡',
    lineage: 'nature', type: 'damage', slotType: 'attack', target: 'all_enemies', statScale: 'power', element: 'nature',
    maxCharges: 3,
    levels: [
      { multiplier: 0.8, hits: 2, desc: '번개 2연격으로 전체 적 강타.' },
      { multiplier: 0.9, hits: 3, desc: '3연격 번개 폭풍.' },
      { multiplier: 1.0, hits: 4, desc: '4연격 대뇌폭풍. 전장을 초토화.' },
      { multiplier: 1.2, hits: 5, awakeningDesc: '대폭풍', desc: '5연격 대폭풍(총 ×6.0). 전장을 소멸시킨다.' },
    ],
  },

  /* ── 자연계 챕터2 획득 ── */
  stone_wall: {
    id: 'stone_wall', name: '석벽', emoji: '🪨',
    lineage: 'nature', type: 'buff', slotType: 'defense', target: 'self', element: 'nature',
    maxCharges: 4,
    levels: [
      { effect: { type: 'defended', duration: 1, mult: 0.6 }, desc: '1턴간 피해 40% 감소.' },
      { effect: { type: 'defended', duration: 1, mult: 0.55 }, healAmount: 50, desc: '피해 45% 감소 + HP +50 회복.' },
      { effect: { type: 'defended', duration: 2, mult: 0.5 }, healAmount: 80, desc: '2턴 피해 50% 감소 + HP +80 회복.' },
      { effect: { type: 'defended', duration: 3, mult: 0.5 }, healAmount: 200, awakeningDesc: '대지의 수호', desc: '3턴 피해 50% 감소 + HP +200 회복.' },
    ],
  },

  /* ── 자연계 챕터3 획득 ── */
  nature_wrath: {
    id: 'nature_wrath', name: '자연의 분노', emoji: '🌿',
    lineage: 'nature', type: 'damage', slotType: 'attack', target: 'all_enemies', statScale: 'mental', element: 'nature',
    maxCharges: 3,
    levels: [
      { multiplier: 1.2, burnEffect: { damage: 15, duration: 1 }, desc: '전체 공격 + 화상 15/턴 × 1턴.' },
      { multiplier: 1.5, burnEffect: { damage: 20, duration: 2 }, desc: '전체 공격 + 화상 20/턴 × 2턴.' },
      { multiplier: 1.8, burnEffect: { damage: 30, duration: 2 }, desc: '강렬한 전체 공격 + 화상 30/턴 × 2턴.' },
      { multiplier: 2.5, poisonEffect: { damage: 25, stackDamage: 10, duration: 3 }, awakeningDesc: '자연의 심판', desc: '전체 강타 + 독(25→35→45/턴×3턴).' },
    ],
  },

/* ═══════════════════════════════════════
   물리계 추가 스킬
═══════════════════════════════════════ */

  /* ── 물리계 공격 추가 ── */
  counter_strike: {
    id: 'counter_strike', name: '반격 일격', emoji: '🥊',
    lineage: 'physical', type: 'damage', slotType: 'attack', target: 'enemy', statScale: 'power', element: 'physical',
    maxCharges: 3,
    levels: [
      { multiplier: 2.2, desc: '반격의 기세로 강타한다. 방어 직후 사용 시 효과 증가.' },
      { multiplier: 2.8, desc: '더 빠르고 강한 반격.' },
      { multiplier: 3.5, bleedEffect: { damage: 30, duration: 2 }, desc: '극한의 반격. 출혈 유발.' },
      { multiplier: 5.0, bleedEffect: { damage: 50, duration: 3 }, awakeningDesc: '역습의 달인', desc: '상대를 완전히 압도하는 반격. 출혈 50×3턴.' },
    ],
  },

  shockwave: {
    id: 'shockwave', name: '충격파', emoji: '💫',
    lineage: 'physical', type: 'damage', slotType: 'attack', target: 'all_enemies', statScale: 'power', element: 'physical',
    maxCharges: 3,
    levels: [
      { multiplier: 1.2, desc: '전방위 충격파를 발산한다.' },
      { multiplier: 1.6, desc: '더 강력한 충격파.' },
      { multiplier: 2.0, bleedEffect: { damage: 20, duration: 2 }, desc: '폭발적 충격파. 전체 출혈.' },
      { multiplier: 2.8, bleedEffect: { damage: 35, duration: 3 }, awakeningDesc: '폭풍의 심판', desc: '세상을 가르는 충격파. 전체 강타+출혈.' },
    ],
  },

  /* ── 물리계 방어 추가 ── */
  parry: {
    id: 'parry', name: '패리', emoji: '🤺',
    lineage: 'physical', type: 'buff', slotType: 'defense', target: 'self', element: 'physical',
    maxCharges: 3,
    levels: [
      { effect: { type: 'dodge_next', duration: 1 }, healAmount: 20, desc: '다음 공격을 받아 흘리고 HP 20 회복.' },
      { effect: { type: 'dodge_next', duration: 1 }, healAmount: 45, desc: '완벽한 패리. HP 45 회복.' },
      { effect: { type: 'dodge_next', duration: 1 }, healAmount: 70, comboEffect: { type: 'overdrive', duration: 1, atkMult: 1.5 }, desc: '패리 후 반격 준비. HP+70, 다음 공격 ×1.5.' },
      { effect: { type: 'dodge_next', duration: 1 }, healAmount: 120, comboEffect: { type: 'overdrive', duration: 2, atkMult: 2.0 }, awakeningDesc: '완벽한 반격', desc: '완벽한 패리+반격 체계. HP+120, 2턴 공격력 ×2.0.' },
    ],
  },

  bulwark: {
    id: 'bulwark', name: '철갑', emoji: '🏰',
    lineage: 'physical', type: 'buff', slotType: 'defense', target: 'self', element: 'physical',
    maxCharges: 4,
    levels: [
      { effect: { type: 'defended', duration: 2, mult: 0.3 }, desc: '철갑 방어. 2턴간 피해 70% 감소.' },
      { effect: { type: 'defended', duration: 3, mult: 0.3 }, desc: '3턴간 피해 70% 감소.' },
      { effect: { type: 'defended', duration: 3, mult: 0.25 }, healAmount: 60, desc: '3턴 피해 75% 감소 + HP+60.' },
      { effect: { type: 'defended', duration: 4, mult: 0.2 }, healAmount: 100, awakeningDesc: '난공불락', desc: '4턴 피해 80% 감소 + HP+100. 아무것도 뚫을 수 없다.' },
    ],
  },

  battle_hardening: {
    id: 'battle_hardening', name: '단련', emoji: '🔰',
    lineage: 'physical', type: 'buff', slotType: 'defense', target: 'self', element: 'physical',
    maxCharges: 3,
    levels: [
      { effect: { type: 'overdrive', duration: 2, atkMult: 1.5 }, desc: '전투 단련으로 2턴간 공격력 ×1.5.' },
      { effect: { type: 'overdrive', duration: 2, atkMult: 2.0 }, desc: '극한 단련. 2턴간 공격력 ×2.0.' },
      { effect: { type: 'overdrive', duration: 3, atkMult: 2.0 }, healAmount: 50, desc: '3턴 공격력 ×2.0 + HP+50.' },
      { effect: { type: 'overdrive', duration: 3, atkMult: 3.0 }, healAmount: 100, awakeningDesc: '전쟁의 화신', desc: '3턴 공격력 ×3.0 + HP+100. 파괴의 화신으로 각성.' },
    ],
  },

  endurance: {
    id: 'endurance', name: '인내', emoji: '🛡',
    lineage: 'physical', type: 'buff', slotType: 'defense', target: 'self', element: 'physical',
    maxCharges: 4,
    levels: [
      { effect: { type: 'defended', duration: 2, mult: 0.4 }, healAmount: 40, desc: '인내로 버팀. 피해 60% 감소 2턴 + HP+40.' },
      { effect: { type: 'defended', duration: 3, mult: 0.4 }, healAmount: 70, desc: '3턴 피해 60% 감소 + HP+70.' },
      { effect: { type: 'defended', duration: 3, mult: 0.35 }, healAmount: 100, desc: '3턴 피해 65% 감소 + HP+100.' },
      { effect: { type: 'defended', duration: 4, mult: 0.3 }, healAmount: 150, awakeningDesc: '불굴의 의지', desc: '4턴 피해 70% 감소 + HP+150. 결코 쓰러지지 않는다.' },
    ],
  },

  /* ── 물리계 스페셜 추가 ── */
  battle_stance: {
    id: 'battle_stance', name: '전투 태세', emoji: '🥋',
    lineage: 'physical', type: 'buff', slotType: 'special', target: 'self', element: 'physical',
    maxCharges: 3,
    levels: [
      { effect: { type: 'overdrive', duration: 2, atkMult: 1.8 }, desc: '전투 태세 돌입. 2턴간 공격력 ×1.8.' },
      { effect: { type: 'overdrive', duration: 3, atkMult: 2.0 }, desc: '완전한 전투 태세. 3턴 공격력 ×2.0.' },
      { effect: { type: 'overdrive', duration: 3, atkMult: 2.0 }, extraTurn: true, desc: '전투 태세 + 추가 행동 획득.' },
      { effect: { type: 'overdrive', duration: 4, atkMult: 2.5 }, extraTurn: true, awakeningDesc: '전장의 신', desc: '4턴 ×2.5 + 추가 행동. 전장의 절대자.' },
    ],
  },

  exposed_weakness: {
    id: 'exposed_weakness', name: '약점 노출', emoji: '🎯',
    lineage: 'physical', type: 'debuff', slotType: 'special', target: 'enemy', element: 'physical',
    maxCharges: 3,
    levels: [
      { effect: { type: 'exposed', duration: 2, damageUp: 0.3 }, desc: '적의 약점을 파악해 2턴간 받는 피해 +30%.' },
      { effect: { type: 'exposed', duration: 3, damageUp: 0.4 }, desc: '3턴간 받는 피해 +40%.' },
      { effect: { type: 'exposed', duration: 3, damageUp: 0.5 }, desc: '3턴간 받는 피해 +50%.' },
      { effect: { type: 'exposed', duration: 4, damageUp: 0.7 }, awakeningDesc: '숨겨진 급소', desc: '4턴간 받는 피해 +70%. 모든 약점을 드러낸다.' },
    ],
  },

  ground_slam: {
    id: 'ground_slam', name: '대지 강타', emoji: '🌋',
    lineage: 'physical', type: 'damage', slotType: 'special', target: 'all_enemies', statScale: 'power', element: 'physical',
    maxCharges: 2,
    levels: [
      { multiplier: 1.5, desc: '대지를 강타해 전체 적에게 충격을 준다.' },
      { multiplier: 2.0, desc: '더 강한 대지 강타.' },
      { multiplier: 2.5, burnEffect: { damage: 20, duration: 2 }, desc: '폭발적 대지 강타. 전체 화상.' },
      { multiplier: 3.5, burnEffect: { damage: 40, duration: 3 }, awakeningDesc: '지각 붕괴', desc: '세상 끝의 강타. 전체 초화상.' },
    ],
  },

  berserker_rage: {
    id: 'berserker_rage', name: '광전사 분노', emoji: '💢',
    lineage: 'physical', type: 'buff', slotType: 'special', target: 'self', element: 'physical',
    maxCharges: 2,
    levels: [
      { effect: { type: 'overdrive', duration: 2, atkMult: 2.5 }, desc: '분노로 각성. 2턴간 공격력 ×2.5.' },
      { effect: { type: 'overdrive', duration: 3, atkMult: 2.5 }, desc: '3턴간 ×2.5 광란.' },
      { effect: { type: 'overdrive', duration: 3, atkMult: 3.0 }, desc: '극한의 광분. 3턴 ×3.0.' },
      { effect: { type: 'overdrive', duration: 4, atkMult: 4.0 }, awakeningDesc: '원초적 분노', desc: '4턴 ×4.0. 이성의 끝에서 각성한 원초적 힘.' },
    ],
  },

/* ═══════════════════════════════════════
   정신계 추가 스킬
═══════════════════════════════════════ */

  /* ── 정신계 공격 추가 ── */
  psi_burst: {
    id: 'psi_burst', name: '정신 폭발', emoji: '🌌',
    lineage: 'psychic', type: 'damage', slotType: 'attack', target: 'all_enemies', statScale: 'mental', element: 'psychic',
    maxCharges: 3,
    levels: [
      { multiplier: 1.3, desc: '정신 에너지를 폭발시켜 전체 적을 강타.' },
      { multiplier: 1.7, desc: '강화된 정신 폭발.' },
      { multiplier: 2.2, desc: '초월적 정신 폭발.' },
      { multiplier: 3.0, awakeningDesc: '우주의 파열', desc: '우주를 가르는 정신 폭발. 모든 존재를 무너뜨린다.' },
    ],
  },

  psychic_lance: {
    id: 'psychic_lance', name: '정신 창', emoji: '🔱',
    lineage: 'psychic', type: 'damage', slotType: 'attack', target: 'enemy', statScale: 'mental', element: 'psychic',
    maxCharges: 3,
    levels: [
      { multiplier: 2.5, desc: '정신력을 창으로 응집해 관통한다.' },
      { multiplier: 3.2, desc: '더 날카로운 정신의 창.' },
      { multiplier: 4.0, desc: '최고의 정신 관통력.' },
      { multiplier: 5.5, awakeningDesc: '절대 관통', desc: '무엇도 막을 수 없는 정신의 절대 창.' },
    ],
  },

  mind_crush: {
    id: 'mind_crush', name: '정신 분쇄', emoji: '💥',
    lineage: 'psychic', type: 'damage', slotType: 'attack', target: 'enemy', statScale: 'mental', element: 'psychic',
    maxCharges: 3,
    levels: [
      { multiplier: 2.0, poisonEffect: { damage: 10, stackDamage: 3, duration: 3 }, desc: '정신을 분쇄하며 독성 충격을 남긴다.' },
      { multiplier: 2.5, poisonEffect: { damage: 15, stackDamage: 5, duration: 3 }, desc: '강화된 분쇄. 독 15+5/턴.' },
      { multiplier: 3.2, poisonEffect: { damage: 20, stackDamage: 8, duration: 3 }, desc: '극한 분쇄. 독 20+8/턴.' },
      { multiplier: 4.5, poisonEffect: { damage: 30, stackDamage: 15, duration: 4 }, awakeningDesc: '정신 말살', desc: '정신을 완전히 말살. 독 30+15/턴×4.' },
    ],
  },

  /* ── 정신계 방어 추가 ── */
  psychic_shield: {
    id: 'psychic_shield', name: '정신 방어막', emoji: '🔮',
    lineage: 'psychic', type: 'buff', slotType: 'defense', target: 'self', element: 'psychic',
    maxCharges: 3,
    levels: [
      { effect: { type: 'defended', duration: 2, mult: 0.4 }, healAmount: 30, desc: '정신력으로 방어막 형성. 2턴 피해 60%↓ + HP+30.' },
      { effect: { type: 'defended', duration: 2, mult: 0.35 }, healAmount: 60, desc: '피해 65%↓ + HP+60.' },
      { effect: { type: 'defended', duration: 3, mult: 0.3 }, healAmount: 90, desc: '3턴 피해 70%↓ + HP+90.' },
      { effect: { type: 'defended', duration: 3, mult: 0.2 }, healAmount: 150, awakeningDesc: '절대 정신 방벽', desc: '3턴 피해 80%↓ + HP+150.' },
    ],
  },

  temporal_shift: {
    id: 'temporal_shift', name: '시간 이동', emoji: '⏰',
    lineage: 'psychic', type: 'buff', slotType: 'defense', target: 'self', element: 'psychic',
    maxCharges: 3,
    levels: [
      { effect: { type: 'dodge_next', duration: 1 }, secondEffect: { type: 'exposed', duration: 2, damageUp: 0.2 }, desc: '시간을 이동해 회피. 적 피해 +20% 2턴.' },
      { effect: { type: 'dodge_next', duration: 1 }, secondEffect: { type: 'exposed', duration: 3, damageUp: 0.3 }, desc: '회피 + 적 피해 +30% 3턴.' },
      { effect: { type: 'dodge_next', duration: 1 }, secondEffect: { type: 'exposed', duration: 3, damageUp: 0.4 }, extraTurn: true, desc: '회피 + 적 피해 +40% + 추가 행동.' },
      { effect: { type: 'dodge_next', duration: 1 }, secondEffect: { type: 'exposed', duration: 4, damageUp: 0.6 }, extraTurn: true, awakeningDesc: '시간의 지배', desc: '회피 + 피해 +60% 4턴 + 추가 행동.' },
    ],
  },

  mind_mirror: {
    id: 'mind_mirror', name: '정신 거울', emoji: '🪞',
    lineage: 'psychic', type: 'buff', slotType: 'defense', target: 'self', element: 'psychic',
    maxCharges: 3,
    levels: [
      { effect: { type: 'defended', duration: 2, mult: 0.5 }, healAmount: 40, desc: '정신 거울로 피해 반사. 2턴 50%↓ + HP+40.' },
      { effect: { type: 'defended', duration: 2, mult: 0.4 }, healAmount: 80, desc: '피해 60%↓ + HP+80.' },
      { effect: { type: 'defended', duration: 3, mult: 0.4 }, healAmount: 120, desc: '3턴 피해 60%↓ + HP+120.' },
      { effect: { type: 'defended', duration: 3, mult: 0.3 }, healAmount: 200, awakeningDesc: '완전 반사', desc: '3턴 피해 70%↓ + HP+200.' },
    ],
  },

  foresight: {
    id: 'foresight', name: '예지', emoji: '👁',
    lineage: 'psychic', type: 'buff', slotType: 'defense', target: 'self', element: 'psychic',
    maxCharges: 3,
    levels: [
      { effect: { type: 'dodge_next', duration: 1 }, desc: '미래를 예지해 다음 공격 회피.' },
      { effect: { type: 'dodge_next', duration: 1 }, extraTurn: true, desc: '예지 + 추가 행동.' },
      { effect: { type: 'dodge_next', duration: 1 }, extraTurn: true, healAmount: 60, desc: '예지 + 추가 행동 + HP+60.' },
      { effect: { type: 'dodge_next', duration: 1 }, extraTurn: true, healAmount: 100, secondEffect: { type: 'exposed', duration: 2, damageUp: 0.4 }, awakeningDesc: '절대 예지', desc: '예지 + 추가 행동 + HP+100 + 적 피해 +40%.' },
    ],
  },

  /* ── 정신계 스페셜 추가 ── */
  neural_override: {
    id: 'neural_override', name: '신경 장악', emoji: '🧠',
    lineage: 'psychic', type: 'special', slotType: 'special', target: 'enemy', element: 'psychic',
    maxCharges: 2,
    levels: [
      { dominateMult: 0.7, desc: '적 신경을 장악해 자해하게 만든다 (ATK×0.7).' },
      { dominateMult: 0.9, followEffect: { type: 'stun', duration: 1 }, desc: '자해 ATK×0.9 + 1턴 행동 불능.' },
      { dominateMult: 1.1, followEffect: { type: 'fear', duration: 2, atkMult: 0.6 }, desc: '자해 ATK×1.1 + 2턴 공포.' },
      { dominateMult: 1.8, followEffect: { type: 'fear', duration: 3, atkMult: 0.5 }, awakeningDesc: '완전 신경 지배', desc: 'ATK×1.8 자해 + 3턴 공포 50%↓.' },
    ],
  },

  mass_confusion: {
    id: 'mass_confusion', name: '집단 혼란', emoji: '🌀',
    lineage: 'psychic', type: 'damage', slotType: 'special', target: 'all_enemies', statScale: 'mental', element: 'psychic',
    maxCharges: 2,
    levels: [
      { multiplier: 0.8, poisonEffect: { damage: 12, stackDamage: 4, duration: 3 }, desc: '집단 혼란으로 모든 적에게 정신 피해 + 독.' },
      { multiplier: 1.0, poisonEffect: { damage: 18, stackDamage: 6, duration: 3 }, desc: '강화된 집단 혼란.' },
      { multiplier: 1.3, poisonEffect: { damage: 25, stackDamage: 10, duration: 3 }, desc: '극한 집단 혼란.' },
      { multiplier: 2.0, poisonEffect: { damage: 35, stackDamage: 15, duration: 4 }, awakeningDesc: '정신 붕괴의 파도', desc: '모든 정신을 붕괴시키는 파도.' },
    ],
  },

  mind_link: {
    id: 'mind_link', name: '정신 연결', emoji: '🔗',
    lineage: 'psychic', type: 'buff', slotType: 'special', target: 'self', element: 'psychic',
    maxCharges: 3,
    levels: [
      { effect: { type: 'overdrive', duration: 2, atkMult: 1.8 }, secondEffect: { type: 'exposed', duration: 2, damageUp: 0.25 }, desc: '정신 연결로 자신 강화 + 적 약점 노출.' },
      { effect: { type: 'overdrive', duration: 2, atkMult: 2.2 }, secondEffect: { type: 'exposed', duration: 3, damageUp: 0.35 }, desc: '더 강한 연결. ×2.2 + 적 피해 +35%.' },
      { effect: { type: 'overdrive', duration: 3, atkMult: 2.5 }, secondEffect: { type: 'exposed', duration: 3, damageUp: 0.45 }, desc: '3턴 ×2.5 + 적 피해 +45%.' },
      { effect: { type: 'overdrive', duration: 3, atkMult: 3.5 }, secondEffect: { type: 'exposed', duration: 4, damageUp: 0.6 }, awakeningDesc: '절대 공명', desc: '3턴 ×3.5 + 적 피해 +60% 4턴.' },
    ],
  },

/* ═══════════════════════════════════════
   자연계 추가 스킬
═══════════════════════════════════════ */

  /* ── 자연계 공격 추가 ── */
  thorn_whip: {
    id: 'thorn_whip', name: '가시 채찍', emoji: '🌿',
    lineage: 'nature', type: 'damage', slotType: 'attack', target: 'all_enemies', statScale: 'power', element: 'nature',
    maxCharges: 3,
    levels: [
      { multiplier: 1.3, desc: '가시 채찍으로 전체 적을 강타.' },
      { multiplier: 1.7, bleedEffect: { damage: 20, duration: 2 }, desc: '전체 강타 + 출혈.' },
      { multiplier: 2.2, bleedEffect: { damage: 30, duration: 3 }, desc: '강력한 가시 채찍 + 출혈 30×3턴.' },
      { multiplier: 3.0, bleedEffect: { damage: 50, duration: 3 }, awakeningDesc: '천가시 폭풍', desc: '전체에 가시 폭풍 + 출혈 50×3턴.' },
    ],
  },

  /* ── 자연계 방어 추가 ── */
  bark_skin: {
    id: 'bark_skin', name: '나무껍질', emoji: '🪵',
    lineage: 'nature', type: 'buff', slotType: 'defense', target: 'self', element: 'nature',
    maxCharges: 4,
    levels: [
      { effect: { type: 'defended', duration: 2, mult: 0.45 }, healAmount: 35, desc: '나무껍질로 방어. 2턴 피해 55%↓ + HP+35.' },
      { effect: { type: 'defended', duration: 3, mult: 0.4 }, healAmount: 65, desc: '3턴 60%↓ + HP+65.' },
      { effect: { type: 'defended', duration: 3, mult: 0.35 }, healAmount: 95, desc: '3턴 65%↓ + HP+95.' },
      { effect: { type: 'defended', duration: 4, mult: 0.3 }, healAmount: 140, awakeningDesc: '고목의 수호', desc: '4턴 70%↓ + HP+140.' },
    ],
  },

  root_bind: {
    id: 'root_bind', name: '뿌리 속박', emoji: '🌱',
    lineage: 'nature', type: 'debuff', slotType: 'defense', target: 'enemy', element: 'nature',
    maxCharges: 3,
    levels: [
      { effect: { type: 'stun', duration: 1 }, desc: '뿌리로 묶어 1턴 행동 불능.' },
      { effect: { type: 'stun', duration: 1 }, desc: '더 강한 속박. 1턴 행동 불능.' },
      { effect: { type: 'stun', duration: 2 }, desc: '2턴간 행동 불능.' },
      { effect: { type: 'stun', duration: 3 }, awakeningDesc: '대지의 감금', desc: '3턴간 행동 불능. 대지가 적을 완전히 가둔다.' },
    ],
  },

  nature_mending: {
    id: 'nature_mending', name: '자연 치유', emoji: '🌸',
    lineage: 'nature', type: 'heal', slotType: 'defense', target: 'self', statScale: 'mental', element: 'nature',
    maxCharges: 3,
    levels: [
      { baseHeal: 60, multiplier: 0.8, desc: '자연 에너지로 HP를 회복한다.' },
      { baseHeal: 100, multiplier: 1.0, desc: '더 강한 자연 치유.' },
      { baseHeal: 150, multiplier: 1.2, desc: '풍요로운 자연의 치유.' },
      { baseHeal: 200, multiplier: 1.8, awakeningDesc: '생명의 원천', desc: '생명의 근원에서 솟아나는 치유. 대량 HP 회복.' },
    ],
  },

  earthen_ward: {
    id: 'earthen_ward', name: '대지의 가호', emoji: '🪨',
    lineage: 'nature', type: 'buff', slotType: 'defense', target: 'self', element: 'nature',
    maxCharges: 3,
    levels: [
      { effect: { type: 'defended', duration: 2, mult: 0.35 }, healAmount: 50, desc: '대지의 가호. 2턴 피해 65%↓ + HP+50.' },
      { effect: { type: 'defended', duration: 3, mult: 0.35 }, healAmount: 80, desc: '3턴 피해 65%↓ + HP+80.' },
      { effect: { type: 'defended', duration: 3, mult: 0.3 }, healAmount: 120, desc: '3턴 피해 70%↓ + HP+120.' },
      { effect: { type: 'defended', duration: 4, mult: 0.25 }, healAmount: 180, awakeningDesc: '대지의 심장', desc: '4턴 75%↓ + HP+180.' },
    ],
  },

  /* ── 자연계 스페셜 추가 ── */
  toxic_cloud: {
    id: 'toxic_cloud', name: '독구름', emoji: '☁️',
    lineage: 'nature', type: 'damage', slotType: 'special', target: 'all_enemies', statScale: 'power', element: 'nature',
    maxCharges: 2,
    levels: [
      { multiplier: 0.5, poisonEffect: { damage: 18, stackDamage: 8, duration: 4 }, desc: '독구름 살포. 전체 독 18+8/턴×4.' },
      { multiplier: 0.7, poisonEffect: { damage: 25, stackDamage: 12, duration: 4 }, desc: '더 짙은 독구름.' },
      { multiplier: 1.0, poisonEffect: { damage: 35, stackDamage: 18, duration: 4 }, desc: '치명적 독구름.' },
      { multiplier: 1.5, poisonEffect: { damage: 50, stackDamage: 25, duration: 5 }, awakeningDesc: '죽음의 안개', desc: '생명을 앗아가는 안개. 독 50+25/턴×5.' },
    ],
  },

  earthquake: {
    id: 'earthquake', name: '지진', emoji: '🌍',
    lineage: 'nature', type: 'damage', slotType: 'special', target: 'all_enemies', statScale: 'power', element: 'nature',
    maxCharges: 2,
    levels: [
      { multiplier: 1.8, desc: '강렬한 지진으로 전체를 강타.' },
      { multiplier: 2.3, desc: '더 강한 지진.' },
      { multiplier: 2.8, desc: '대지를 뒤흔드는 지진.' },
      { multiplier: 4.0, awakeningDesc: '대지 붕괴', desc: '세상을 붕괴시키는 초지진.' },
    ],
  },

  verdant_surge: {
    id: 'verdant_surge', name: '초록 급증', emoji: '🌊',
    lineage: 'nature', type: 'buff', slotType: 'special', target: 'self', element: 'nature',
    maxCharges: 3,
    levels: [
      { effect: { type: 'overdrive', duration: 2, atkMult: 1.8 }, healAmount: 30, desc: '자연의 힘 급증. 2턴 ×1.8 + HP+30.' },
      { effect: { type: 'overdrive', duration: 2, atkMult: 2.2 }, healAmount: 50, desc: '2턴 ×2.2 + HP+50.' },
      { effect: { type: 'overdrive', duration: 3, atkMult: 2.5 }, healAmount: 80, desc: '3턴 ×2.5 + HP+80.' },
      { effect: { type: 'overdrive', duration: 4, atkMult: 3.2 }, healAmount: 130, awakeningDesc: '자연의 각성', desc: '4턴 ×3.2 + HP+130. 자연 그 자체로 각성.' },
    ],
  },

  symbiosis: {
    id: 'symbiosis', name: '공생', emoji: '🤝',
    lineage: 'nature', type: 'buff', slotType: 'special', target: 'self', element: 'nature',
    maxCharges: 3,
    levels: [
      { effect: { type: 'overdrive', duration: 2, atkMult: 1.5 }, healAmount: 50, desc: '공생 계약. 2턴 ×1.5 + HP+50.' },
      { effect: { type: 'overdrive', duration: 2, atkMult: 2.0 }, healAmount: 80, desc: '2턴 ×2.0 + HP+80.' },
      { effect: { type: 'overdrive', duration: 2, atkMult: 2.0 }, healAmount: 80, extraTurn: true, desc: '2턴 ×2.0 + HP+80 + 추가 행동.' },
      { effect: { type: 'overdrive', duration: 3, atkMult: 2.5 }, healAmount: 130, extraTurn: true, awakeningDesc: '생명의 공명', desc: '3턴 ×2.5 + HP+130 + 추가 행동.' },
    ],
  },

  spore_burst: {
    id: 'spore_burst', name: '포자 폭발', emoji: '🍄',
    lineage: 'nature', type: 'damage', slotType: 'special', target: 'all_enemies', statScale: 'mental', element: 'nature',
    maxCharges: 2,
    levels: [
      { multiplier: 1.0, poisonEffect: { damage: 15, stackDamage: 6, duration: 3 }, desc: '포자를 폭발시켜 전체에 독 살포.' },
      { multiplier: 1.3, poisonEffect: { damage: 22, stackDamage: 10, duration: 3 }, desc: '강화된 포자 폭발.' },
      { multiplier: 1.7, poisonEffect: { damage: 30, stackDamage: 15, duration: 4 }, desc: '치명적 포자 폭발. 독 30+15/턴×4.' },
      { multiplier: 2.5, poisonEffect: { damage: 45, stackDamage: 22, duration: 4 }, awakeningDesc: '균사 네트워크', desc: '균사 네트워크로 모든 생명을 잠식. 독 45+22/턴×4.' },
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
