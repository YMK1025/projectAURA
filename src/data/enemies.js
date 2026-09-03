/* 적 정의
   pattern: [{action, weight, ...}] — 가중치 기반 행동 AI
*/
export const ENEMIES = {

  /* ═══ 일반 적 ═══ */

  aura_guard: {
    id: 'aura_guard', name: 'AURA 경비원', emoji: '🕴️',
    maxHp: 160, atk: 28, def: 7,
    expReward: 40, goldReward: 50,
    itemDrop: { itemId: 'recovery_s', chance: 0.3 },
    pattern: [
      { action: 'attack', weight: 7 },
      { action: 'defend', weight: 3 },
    ],
  },
  nexus_agent: {
    id: 'nexus_agent', name: 'Nexus 요원', emoji: '🥷',
    maxHp: 150, atk: 35, def: 5,
    expReward: 55, goldReward: 65,
    itemDrop: { itemId: 'stabilizer', chance: 0.25 },
    pattern: [
      { action: 'attack', weight: 6 },
      { action: 'skill', weight: 3, skillName: '기습', skillDmgMult: 1.6 },
      { action: 'defend', weight: 1 },
    ],
  },
  rogue_awakened: {
    id: 'rogue_awakened', name: '폭주 각성자', emoji: '⚡',
    maxHp: 200, atk: 40, def: 4,
    expReward: 60, goldReward: 80,
    itemDrop: { itemId: 'energy_drink', chance: 0.4 },
    pattern: [
      { action: 'attack', weight: 5 },
      { action: 'skill', weight: 4, skillName: '능력 방출', skillDmgMult: 1.8 },
      { action: 'berserk', weight: 1 },
    ],
  },
  oracle_follower: {
    id: 'oracle_follower', name: '오라클 추종자', emoji: '👤',
    maxHp: 160, atk: 32, def: 6,
    expReward: 55, goldReward: 65,
    itemDrop: { itemId: 'antidote', chance: 0.2 },
    pattern: [
      { action: 'attack', weight: 5 },
      { action: 'skill', weight: 3, skillName: '세뇌 파동', skillDmgMult: 0, debuff: 'fear' },
      { action: 'defend', weight: 2 },
    ],
  },
  oracle_agent: {
    id: 'oracle_agent', name: '오라클 전투 요원', emoji: '🕵️',
    maxHp: 210, atk: 46, def: 10,
    expReward: 70, goldReward: 90,
    itemDrop: { itemId: 'stabilizer', chance: 0.3 },
    pattern: [
      { action: 'attack', weight: 4 },
      { action: 'skill', weight: 4, skillName: '암습', skillDmgMult: 1.8 },
      { action: 'skill', weight: 2, skillName: '독 주입', skillDmgMult: 0, debuff: 'fear' },
    ],
  },
  nexus_elite: {
    id: 'nexus_elite', name: 'Nexus 정예 요원', emoji: '🔷',
    maxHp: 230, atk: 55, def: 12,
    expReward: 75, goldReward: 100,
    itemDrop: { itemId: 'energy_drink', chance: 0.3 },
    pattern: [
      { action: 'attack', weight: 4 },
      { action: 'skill', weight: 4, skillName: '연속 타격', skillDmgMult: 0.7, hits: 2 },
      { action: 'skill', weight: 2, skillName: '돌격', skillDmgMult: 2.0 },
    ],
  },
  aura_elite: {
    id: 'aura_elite', name: 'AURA 특수 요원', emoji: '🔶',
    maxHp: 240, atk: 52, def: 15,
    expReward: 75, goldReward: 100,
    itemDrop: { itemId: 'recovery_s', chance: 0.3 },
    pattern: [
      { action: 'attack', weight: 4 },
      { action: 'skill', weight: 3, skillName: '제압 타격', skillDmgMult: 1.7, debuff: 'stun' },
      { action: 'defend', weight: 3 },
    ],
  },

  /* ═══ 챕터 보스 ═══ */

  rogue_elite: {
    id: 'rogue_elite', name: '나비 (폭주 각성자)', emoji: '🦋',
    maxHp: 240, atk: 48, def: 8,
    expReward: 100, goldReward: 120,
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 4 },
      { action: 'skill', weight: 4, skillName: '혼돈의 날개', skillDmgMult: 1.7 },
      { action: 'berserk', weight: 2 },
    ],
    description: '능력 폭주로 이성을 잃은 젊은 각성자.',
    introText: '"...멈추고 싶어. 그런데 멈출 수가 없어."',
  },
  nexus_operative: {
    id: 'nexus_operative', name: '야차 (오라클 연계 요원)', emoji: '🐉',
    maxHp: 340, atk: 60, def: 13,
    expReward: 150, goldReward: 170,
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 3 },
      { action: 'skill', weight: 4, skillName: '강철 주먹', skillDmgMult: 1.0, hits: 2 },
      { action: 'skill', weight: 3, skillName: '맹돌진', skillDmgMult: 2.2 },
    ],
    description: '오라클의 지시를 받는 강력한 근접 전투 능력자.',
    introText: '"더는 못 가게 할 거야. 여기서 끝내지."',
  },
  oracle_commander: {
    id: 'oracle_commander', name: '가시 (오라클 간부)', emoji: '🌹',
    maxHp: 500, atk: 70, def: 16,
    expReward: 200, goldReward: 220,
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 2 },
      { action: 'skill', weight: 4, skillName: '가시 파열', skillDmgMult: 2.0, debuff: 'fear' },
      { action: 'skill', weight: 3, skillName: '공포의 장막', skillDmgMult: 0, debuff: 'stun' },
      { action: 'defend', weight: 1 },
    ],
    description: '오라클 조직의 핵심 간부. 공포를 무기로 다루는 정신계 능력자.',
    introText: '"오라클의 이상을 막으려는 건가. 네가 얼마나 버티나 보지."',
  },

  /* ═══ 중간 보스 ═══ */

  aura_captain: {
    id: 'aura_captain', name: 'AURA 기동대장', emoji: '🎖️',
    maxHp: 500, atk: 58, def: 18,
    expReward: 160, goldReward: 200,
    itemDrop: { itemId: 'reinforced_suit', chance: 0.5 },
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 4 },
      { action: 'skill', weight: 4, skillName: '제압 충격', skillDmgMult: 1.6, debuff: 'stun' },
      { action: 'defend', weight: 2 },
    ],
    description: 'AURA 기동대의 현장 지휘관. 반역자를 처리하기 위해 출동했다.',
    introText: '"요원 신분으로 반역이라니. 직접 처리하겠다."',
  },
  nexus_lieutenant: {
    id: 'nexus_lieutenant', name: 'Nexus 부사령관', emoji: '🔫',
    maxHp: 440, atk: 65, def: 13,
    expReward: 180, goldReward: 220,
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 3 },
      { action: 'skill', weight: 4, skillName: '연속 사격', skillDmgMult: 0.7, hits: 2 },
      { action: 'skill', weight: 3, skillName: '게릴라 전술', skillDmgMult: 2.2 },
    ],
    description: 'Nexus의 전술 지휘관.',
    introText: '"AURA의 개가 됐군. 여기서 끝이야."',
  },
  jiyu_boss: {
    id: 'jiyu_boss', name: '지유 (Ji-Yu)', emoji: '🗡️',
    maxHp: 600, atk: 72, def: 22,
    expReward: 280, goldReward: 0,
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 3 },
      { action: 'skill', weight: 4, skillName: '정밀 타격', skillDmgMult: 1.9 },
      { action: 'skill', weight: 2, skillName: '방어 충격', skillDmgMult: 1.5 },
      { action: 'defend', weight: 1 },
    ],
    description: 'AURA 선임 요원. 당신의 동료였던 사람.',
    introText: '"...선택한 거잖아. 나도 막아야 해."',
    uniqueDialogue: true,
  },
  kai_boss: {
    id: 'kai_boss', name: '카이 (Kai)', emoji: '⚡',
    maxHp: 580, atk: 72, def: 16,
    expReward: 280, goldReward: 0,
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 3 },
      { action: 'skill', weight: 4, skillName: '전기 폭발', skillDmgMult: 2.0 },
      { action: 'skill', weight: 3, skillName: '충전 방전', skillDmgMult: 2.5 },
    ],
    description: 'Nexus 연락책. 전기 능력자.',
    introText: '"배신자. 내 손으로 끝낼게."',
    uniqueDialogue: true,
  },

  /* ═══ 최종 보스 ═══ */

  echo: {
    id: 'echo', name: 'Echo (Nexus 수장)', emoji: '🌑',
    maxHp: 900, atk: 90, def: 22,
    expReward: 350, goldReward: 0,
    isFinalBoss: true,
    pattern: [
      { action: 'attack', weight: 2 },
      { action: 'skill', weight: 4, skillName: '공명 파동', skillDmgMult: 2.2 },
      { action: 'skill', weight: 3, skillName: '집단 세뇌', skillDmgMult: 0, debuff: 'fear' },
      { action: 'skill', weight: 1, skillName: '공명 폭발', skillDmgMult: 3.5 },
    ],
    description: 'Nexus를 이끄는 수장. 초능력자의 인류 지배를 꿈꾸는 광신자.',
    introText: '"자유란 강자가 지배하는 것. 인간은 이미 시대에 뒤처졌어."',
  },
  director_kang: {
    id: 'director_kang', name: '강 국장 (AURA 총책임자)', emoji: '👔',
    maxHp: 800, atk: 78, def: 28,
    expReward: 350, goldReward: 0,
    isFinalBoss: true,
    pattern: [
      { action: 'attack', weight: 2 },
      { action: 'skill', weight: 4, skillName: '능력 억제 필드', skillDmgMult: 0, debuff: 'suppressed' },
      { action: 'skill', weight: 3, skillName: '전술 공격', skillDmgMult: 2.0 },
      { action: 'skill', weight: 1, skillName: '최후 명령', skillDmgMult: 3.0 },
    ],
    description: '프로젝트 AURA의 총책임자. 쿠데타를 획책하는 부패한 권력자.',
    introText: '"통제를 거부하는 자는 위협이다. 오래전부터 알고 있었어."',
  },
};
