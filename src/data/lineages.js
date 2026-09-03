/* ─── 1차 계열 정의 ─── */
export const LINEAGES = {
  physical: {
    id: 'physical', name: '물리계', emoji: '⚔️', color: '#ef5350',
    desc: '신체 능력을 극한까지 끌어올린다.\n강인한 체력과 압도적인 물리력.',
    flavor: '힘이 곧 법이다',
    commonSkillId: 'smash',
    jobs: ['guardian', 'beast_shifter'],
    initStats: { power: 18, control: 14, mental: 5 },
    initHp: 330, initMp: 130,
  },
  psychic: {
    id: 'psychic', name: '정신계', emoji: '🧠', color: '#ce93d8',
    desc: '초월적인 정신력으로 적을 제압한다.\n염동력, 예지, 정신 조작.',
    flavor: '마음이 현실을 만든다',
    commonSkillId: 'tele_strike',
    jobs: ['clairvoyant', 'dominator'],
    initStats: { power: 8, control: 18, mental: 22 },
    initHp: 220, initMp: 270,
  },
  nature: {
    id: 'nature', name: '자연계', emoji: '🌊', color: '#4fc3f7',
    desc: '자연의 힘을 자유자재로 다룬다.\n불꽃, 번개로 전장을 지배.',
    flavor: '자연은 통제되지 않는다',
    commonSkillId: 'element_burst',
    jobs: ['pyromancer', 'storm_caller'],
    initStats: { power: 15, control: 10, mental: 18 },
    initHp: 270, initMp: 220,
  },
};
