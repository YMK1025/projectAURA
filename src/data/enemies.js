/* 적 정의
   pattern: [{action, weight, ...}] — 가중치 기반 행동 AI
   action: 'attack' | 'skill' | 'defend'
*/
export const ENEMIES = {
  /* ── 일반 적 ─── */
  aura_guard: {
    id: 'aura_guard', name: 'AURA 경비원', emoji: '🕴️',
    maxHp: 180, atk: 28, def: 8,
    expReward: 0, goldReward: 60,
    itemDrop: { itemId: 'recovery_s', chance: 0.3 },
    pattern: [
      { action: 'attack', weight: 7 },
      { action: 'defend', weight: 3 },
    ],
    description: 'AURA 기지의 일반 경비 요원.',
  },
  nexus_agent: {
    id: 'nexus_agent', name: 'Nexus 요원', emoji: '🥷',
    maxHp: 150, atk: 35, def: 5,
    expReward: 0, goldReward: 70,
    itemDrop: { itemId: 'stabilizer', chance: 0.25 },
    pattern: [
      { action: 'attack', weight: 6 },
      { action: 'skill', weight: 3, skillName: '기습', skillDmgMult: 1.6 },
      { action: 'defend', weight: 1 },
    ],
    description: 'Nexus의 훈련된 요원. 기습 전술을 즐긴다.',
  },
  rogue_awakened: {
    id: 'rogue_awakened', name: '폭주 각성자', emoji: '⚡',
    maxHp: 220, atk: 42, def: 4,
    expReward: 0, goldReward: 90,
    itemDrop: { itemId: 'energy_drink', chance: 0.4 },
    pattern: [
      { action: 'attack', weight: 5 },
      { action: 'skill', weight: 4, skillName: '능력 방출', skillDmgMult: 1.8 },
      { action: 'berserk', weight: 1 },
    ],
    description: '능력을 통제하지 못하고 폭주한 각성자.',
  },
  oracle_follower: {
    id: 'oracle_follower', name: '오라클 추종자', emoji: '👤',
    maxHp: 160, atk: 30, def: 6,
    expReward: 0, goldReward: 65,
    itemDrop: { itemId: 'antidote', chance: 0.2 },
    pattern: [
      { action: 'attack', weight: 5 },
      { action: 'skill', weight: 3, skillName: '세뇌 파동', skillDmgMult: 0, debuff: 'fear' },
      { action: 'defend', weight: 2 },
    ],
    description: '오라클의 정신 지배를 받은 각성자.',
  },

  /* ── 중간 보스 ─── */
  aura_captain: {
    id: 'aura_captain', name: 'AURA 대장', emoji: '🎖️',
    maxHp: 480, atk: 55, def: 18,
    expReward: 0, goldReward: 200,
    itemDrop: { itemId: 'reinforced_suit', chance: 0.5 },
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 5 },
      { action: 'skill', weight: 3, skillName: '제압', skillDmgMult: 1.5, debuff: 'stun' },
      { action: 'defend', weight: 2 },
    ],
    description: 'AURA 기동대의 현장 지휘관.',
    introText: '"요원 신분으로 반역이라니. 직접 처리하겠다."',
  },
  nexus_lieutenant: {
    id: 'nexus_lieutenant', name: 'Nexus 중위', emoji: '🔫',
    maxHp: 420, atk: 62, def: 12,
    expReward: 0, goldReward: 220,
    itemDrop: { itemId: 'nexus_chip', chance: 0.4 },
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 4 },
      { action: 'skill', weight: 4, skillName: '연속 사격', skillDmgMult: 0.7, hits: 2 },
      { action: 'skill', weight: 2, skillName: '게릴라 전술', skillDmgMult: 2.0 },
    ],
    description: 'Nexus의 전술 지휘관. 공격적인 전투 스타일.',
    introText: '"AURA의 개가 됐군. 기억을 지워주지."',
  },
  jiyu_boss: {
    id: 'jiyu_boss', name: '지유 (Ji-Yu)', emoji: '🗡️',
    maxHp: 550, atk: 70, def: 20,
    expReward: 0, goldReward: 0,
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 4 },
      { action: 'skill', weight: 4, skillName: '정밀 타격', skillDmgMult: 1.8 },
      { action: 'skill', weight: 2, skillName: '방어 태세', skillDmgMult: 0, buff: 'defended' },
    ],
    description: 'AURA 선임 요원. 당신의 동료였던 사람.',
    introText: '"...선택한 거잖아. 나도 막아야 해."',
    uniqueDialogue: true,
  },
  kai_boss: {
    id: 'kai_boss', name: '카이 (Kai)', emoji: '⚔️',
    maxHp: 500, atk: 65, def: 15,
    expReward: 0, goldReward: 0,
    isBoss: true,
    pattern: [
      { action: 'attack', weight: 4 },
      { action: 'skill', weight: 3, skillName: '전기 폭발', skillDmgMult: 2.0 },
      { action: 'skill', weight: 3, skillName: '충전', skillDmgMult: 0, buff: 'overdrive' },
    ],
    description: 'Nexus 연락책. 전기 능력자.',
    introText: '"배신자. 내 손으로 끝낼게."',
    uniqueDialogue: true,
  },

  /* ── 최종 보스 ─── */
  echo: {
    id: 'echo', name: 'Echo (Nexus 수장)', emoji: '🌑',
    maxHp: 999, atk: 90, def: 25,
    expReward: 0, goldReward: 0,
    isFinalBoss: true,
    phases: 2,
    pattern: [
      { action: 'attack', weight: 3 },
      { action: 'skill', weight: 4, skillName: '공명 파동', skillDmgMult: 2.2 },
      { action: 'skill', weight: 2, skillName: '집단 세뇌', skillDmgMult: 0, debuff: 'fear' },
      { action: 'skill', weight: 1, skillName: '공명 폭발', skillDmgMult: 3.0 },
    ],
    phase2Pattern: [
      { action: 'skill', weight: 5, skillName: '공명 폭발', skillDmgMult: 3.0 },
      { action: 'skill', weight: 3, skillName: '집단 세뇌', skillDmgMult: 0, debuff: 'stun' },
      { action: 'attack', weight: 2 },
    ],
    description: 'Nexus를 이끄는 수장. 압도적인 정신 공격 능력자.',
    introText: '"자유는 통제 위에 세워지지 않아. 네가 틀렸어."',
    phaseTransitionHp: 0.5,
    phaseTransitionText: '"...아직 끝나지 않았어!"',
  },
  director_kang: {
    id: 'director_kang', name: '디렉터 강', emoji: '👔',
    maxHp: 800, atk: 75, def: 30,
    expReward: 0, goldReward: 0,
    isFinalBoss: true,
    phases: 2,
    bodyguard: 'aura_captain',
    pattern: [
      { action: 'attack', weight: 2 },
      { action: 'skill', weight: 4, skillName: '능력 억제 필드', skillDmgMult: 0, debuff: 'suppressed' },
      { action: 'skill', weight: 3, skillName: '전술 공격', skillDmgMult: 1.8 },
      { action: 'skill', weight: 1, skillName: '보디가드 호출', skillDmgMult: 0, summon: true },
    ],
    phase2Pattern: [
      { action: 'skill', weight: 4, skillName: '능력 억제 필드', skillDmgMult: 0, debuff: 'suppressed' },
      { action: 'skill', weight: 4, skillName: '최후 명령', skillDmgMult: 2.5 },
      { action: 'attack', weight: 2 },
    ],
    description: '프로젝트 AURA의 총책임자. 초능력 억제 기술을 보유.',
    introText: '"통제를 거부하는 자는 위협이다. 오래전부터 알고 있었어."',
    phaseTransitionHp: 0.45,
    phaseTransitionText: '"...기억해. 내가 틀리지 않았다는 걸."',
  },
};
