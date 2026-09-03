/* 능력 4종 정의 */
export const ABILITIES = {
  telekinesis: {
    id: 'telekinesis',
    name: '염동력', emoji: '🌀',
    desc: '물체를 마음의 힘으로 움직이는 능력. 원거리에서 사물을 조작하고 충격파를 발산한다.',
    flavor: '마음이 곧 힘이 되는 자들의 능력',
    color: '#7c4dff',
    // 초기 스탯 보정
    initStats:  { power: 25, control: 12, mental: 8 },
    initHp: 280, initMp: 160,
    // 전투 패시브 설명
    passive: '파워 기반 공격력 계수 1.3×',
  },
  clairvoyance: {
    id: 'clairvoyance',
    name: '투시', emoji: '👁️',
    desc: '감춰진 것을 꿰뚫어 보는 능력. 벽 너머를 보고, 과거의 잔상을 읽으며, 거짓을 간파한다.',
    flavor: '진실은 언제나 눈 앞에 있다',
    color: '#00bcd4',
    initStats:  { power: 8, control: 18, mental: 22 },
    initHp: 220, initMp: 260,
    passive: '회피율 +15%',
  },
  mindControl: {
    id: 'mindControl',
    name: '정신조작', emoji: '🧠',
    desc: '타인의 감정과 사고에 영향을 미치는 능력. 공포를 심거나 의지를 꺾거나 기억을 지울 수 있다.',
    flavor: '생각을 나누는 자는 세계를 바꾼다',
    color: '#e040fb',
    initStats:  { power: 8, control: 22, mental: 18 },
    initHp: 230, initMp: 270,
    passive: '상태이상 효과 지속 +1턴',
  },
  regeneration: {
    id: 'regeneration',
    name: '재생', emoji: '💠',
    desc: '신체를 빠르게 회복시키는 능력. 상처를 순식간에 봉합하고 독소를 분해하며 육체 한계를 넘어선다.',
    flavor: '부서질수록 더 강해진다',
    color: '#69f0ae',
    initStats:  { power: 18, control: 10, mental: 20 },
    initHp: 380, initMp: 180,
    passive: '전투 종료 후 HP 10% 자동 회복',
  },
};
