/* 스킬 정의
   type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special'
   target: 'enemy' | 'self' | 'all_enemies'
   statScale: 스탯 기반 데미지 계수 (power or mental)
*/
export const SKILLS = {
  /* ── 염동력 ────────────────────── */
  telekinetic_strike: {
    id: 'telekinetic_strike', abilityReq: 'telekinesis',
    name: '염동 충격', emoji: '🌀',
    desc: '마음의 힘으로 적을 강타한다.',
    mpCost: 30, type: 'damage', target: 'enemy',
    statScale: 'power', multiplier: 2.5,
  },
  gravity_shield: {
    id: 'gravity_shield', abilityReq: 'telekinesis',
    name: '중력 방패', emoji: '🛡️',
    desc: '중력장을 펼쳐 1턴간 받는 피해 50% 감소.',
    mpCost: 40, type: 'buff', target: 'self',
    effect: { type: 'defended', duration: 1 },
  },
  object_storm: {
    id: 'object_storm', abilityReq: 'telekinesis',
    name: '오브젝트 스톰', emoji: '💥',
    desc: '주변 물체를 폭발적으로 발사해 모든 적에게 피해.',
    mpCost: 70, type: 'damage', target: 'all_enemies',
    statScale: 'power', multiplier: 1.8,
  },

  /* ── 투시 ──────────────────────── */
  weakness_scan: {
    id: 'weakness_scan', abilityReq: 'clairvoyance',
    name: '약점 분석', emoji: '🔍',
    desc: '적의 약점을 간파해 2턴간 가하는 피해 25% 증가.',
    mpCost: 25, type: 'debuff', target: 'enemy',
    effect: { type: 'exposed', duration: 2, damageUp: 0.25 },
  },
  precog_dodge: {
    id: 'precog_dodge', abilityReq: 'clairvoyance',
    name: '예지 회피', emoji: '⚡',
    desc: '다음 공격을 확정 회피한다.',
    mpCost: 35, type: 'buff', target: 'self',
    effect: { type: 'dodge_next', duration: 1 },
  },
  read_the_flow: {
    id: 'read_the_flow', abilityReq: 'clairvoyance',
    name: '흐름 읽기', emoji: '🌊',
    desc: '이번 턴 한 번 더 행동한다.',
    mpCost: 60, type: 'special', target: 'self',
    effect: { type: 'extra_turn' },
  },

  /* ── 정신조작 ───────────────────── */
  confusion: {
    id: 'confusion', abilityReq: 'mindControl',
    name: '혼란', emoji: '🌀',
    desc: '적의 의식을 흩뜨려 1턴간 행동 불능.',
    mpCost: 30, type: 'debuff', target: 'enemy',
    effect: { type: 'stun', duration: 1 },
  },
  fear_injection: {
    id: 'fear_injection', abilityReq: 'mindControl',
    name: '공포 주입', emoji: '😱',
    desc: '극도의 공포를 심어 2턴간 적 공격력 35% 감소.',
    mpCost: 25, type: 'debuff', target: 'enemy',
    effect: { type: 'fear', duration: 2, atkMult: 0.65 },
  },
  domination: {
    id: 'domination', abilityReq: 'mindControl',
    name: '정신 지배', emoji: '🧠',
    desc: '적의 의식을 장악해 1턴간 아군으로 전환.',
    mpCost: 80, type: 'special', target: 'enemy',
    effect: { type: 'dominated', duration: 1 },
  },

  /* ── 재생 ──────────────────────── */
  rapid_heal: {
    id: 'rapid_heal', abilityReq: 'regeneration',
    name: '급속 회복', emoji: '💚',
    desc: 'HP를 즉시 회복한다. (멘탈 스탯에 비례)',
    mpCost: 20, type: 'heal', target: 'self',
    statScale: 'mental', baseHeal: 120, multiplier: 3,
  },
  pain_suppress: {
    id: 'pain_suppress', abilityReq: 'regeneration',
    name: '고통 억제', emoji: '🔰',
    desc: '1턴간 받는 피해 45% 감소.',
    mpCost: 15, type: 'buff', target: 'self',
    effect: { type: 'defended', duration: 1, mult: 0.55 },
  },
  overdrive: {
    id: 'overdrive', abilityReq: 'regeneration',
    name: '오버드라이브', emoji: '🔥',
    desc: '2턴간 전 스탯 +20, 공격력 1.5×.',
    mpCost: 60, type: 'buff', target: 'self',
    effect: { type: 'overdrive', duration: 2, statBonus: 20, atkMult: 1.5 },
  },
};

/* 능력별 스킬 목록 */
export const ABILITY_SKILLS = {
  telekinesis:  ['telekinetic_strike', 'gravity_shield', 'object_storm'],
  clairvoyance: ['weakness_scan', 'precog_dodge', 'read_the_flow'],
  mindControl:  ['confusion', 'fear_injection', 'domination'],
  regeneration: ['rapid_heal', 'pain_suppress', 'overdrive'],
};
