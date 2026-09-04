export const DIFFICULTIES = [
  {
    id: 0, name: '수련', emoji: '🌱',
    desc: '처음 플레이하는 분을 위한 난이도',
    enemyMult: 0.75,
    startHp: 120,
    chargeBonus: 1,
    rewardBonus: 1,
  },
  {
    id: 1, name: '일반', emoji: '⚔️',
    desc: '표준 난이도',
    enemyMult: 1.0, startHp: 100, chargeBonus: 0, rewardBonus: 1,
  },
  {
    id: 2, name: '고급', emoji: '🔥',
    desc: '숙련된 플레이어를 위한 도전',
    enemyMult: 1.3, startHp: 80, chargeBonus: 0, rewardBonus: 0.9,
  },
  {
    id: 3, name: '극한', emoji: '💀',
    desc: '극한의 도전 — 실수는 용납되지 않는다',
    enemyMult: 1.7, startHp: 60, chargeBonus: -1, rewardBonus: 0.8,
  },
  {
    id: 4, name: '파멸', emoji: '☠️',
    desc: '최강자를 위한 파멸의 길',
    enemyMult: 2.2, startHp: 50, chargeBonus: -1, rewardBonus: 0.7,
  },
];

export function getDifficulty(id) {
  return DIFFICULTIES[id] ?? DIFFICULTIES[1];
}
