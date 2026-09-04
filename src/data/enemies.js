/* 적 정의
   pattern: [{action, weight, ...}] — 가중치 기반 행동 AI
*/
export const ENEMIES = {

  /* ═══ 일반 적 ═══ */

  aura_guard: {
    id: 'aura_guard', name: 'AURA 경비원', emoji: '🕴️',
    maxHp: 65, atk: 15, def: 2,
    expReward: 40, goldReward: 50,
    weakTo: 'psychic', staggerMax: 40,
    itemDrop: { itemId: 'recovery_s', chance: 0.3 },
    pattern: [
      { action: 'attack', weight: 7, hint: '천천히 자세를 낮추며 당신을 향해 다가온다...' },
      { action: 'defend', weight: 3, hint: '뒤로 한 발 물러서며 팔을 올린다...' },
    ],
  },
  nexus_agent: {
    id: 'nexus_agent', name: 'Nexus 요원', emoji: '🥷',
    maxHp: 55, atk: 18, def: 1,
    expReward: 55, goldReward: 65,
    weakTo: 'nature', staggerMax: 35,
    itemDrop: { itemId: 'stabilizer', chance: 0.25 },
    pattern: [
      { action: 'attack', weight: 6, hint: '눈빛이 날카롭게 좁혀지며 몸을 틀기 시작한다...' },
      { action: 'skill', weight: 3, skillName: '기습', skillDmgMult: 1.6, hint: '그림자 속으로 몸을 낮추며 모습을 감춘다...' },
      { action: 'defend', weight: 1, hint: '잠시 거리를 두며 숨을 고르는 것 같다...' },
    ],
  },
  rogue_awakened: {
    id: 'rogue_awakened', name: '폭주 각성자', emoji: '⚡',
    maxHp: 80, atk: 22, def: 1,
    expReward: 60, goldReward: 80,
    weakTo: 'physical', resistTo: 'psychic', staggerMax: 45,
    itemDrop: { itemId: 'energy_drink', chance: 0.4 },
    pattern: [
      { action: 'attack', weight: 5, hint: '억제되지 못한 에너지가 주먹 주변에서 튀어 오른다...' },
      { action: 'skill', weight: 4, skillName: '능력 방출', skillDmgMult: 1.8, hint: '전신을 뒤덮는 빛이 폭발하듯 팽창하기 시작한다...' },
      { action: 'berserk', weight: 1, hint: '눈빛이 완전히 풀리며 거친 숨을 몰아쉰다...' },
    ],
  },
  oracle_follower: {
    id: 'oracle_follower', name: '오라클 추종자', emoji: '👤',
    maxHp: 60, atk: 16, def: 2,
    expReward: 55, goldReward: 65,
    weakTo: 'physical', resistTo: 'psychic', staggerMax: 40,
    itemDrop: { itemId: 'antidote', chance: 0.2 },
    pattern: [
      { action: 'attack', weight: 5, hint: '무표정한 얼굴로 한 걸음씩 접근한다...' },
      { action: 'skill', weight: 3, skillName: '세뇌 파동', skillDmgMult: 0, debuff: 'fear', hint: '양손을 펼치며 기묘한 눈빛으로 당신의 눈을 응시한다...' },
      { action: 'defend', weight: 2, hint: '뒤로 물러서며 조용히 자세를 바로잡는다...' },
    ],
  },
  oracle_agent: {
    id: 'oracle_agent', name: '오라클 전투 요원', emoji: '🕵️',
    maxHp: 120, atk: 35, def: 4,
    expReward: 70, goldReward: 90,
    weakTo: 'physical', resistTo: 'psychic', staggerMax: 55,
    itemDrop: { itemId: 'stabilizer', chance: 0.3 },
    pattern: [
      { action: 'attack', weight: 4, hint: '차갑게 당신을 훑어보더니 손을 앞으로 내민다...' },
      { action: 'skill', weight: 4, skillName: '암습', skillDmgMult: 1.8, hint: '시선을 다른 곳으로 돌리며 슬쩍 옆으로 이동한다...' },
      { action: 'skill', weight: 2, skillName: '독 주입', skillDmgMult: 0, debuff: 'fear', hint: '낮게 중얼거리며 손가락 끝에서 무언가 번득인다...' },
    ],
  },
  nexus_elite: {
    id: 'nexus_elite', name: 'Nexus 정예 요원', emoji: '🔷',
    maxHp: 140, atk: 45, def: 5,
    expReward: 75, goldReward: 100,
    weakTo: 'nature', staggerMax: 65,
    itemDrop: { itemId: 'energy_drink', chance: 0.3 },
    pattern: [
      { action: 'attack', weight: 4, hint: '발을 어깨 너비로 벌리고 중심을 잡는다...' },
      { action: 'skill', weight: 4, skillName: '연속 타격', skillDmgMult: 0.7, hits: 2, hint: '손목을 빠르게 돌리며 리듬을 타듯 몸을 흔든다...' },
      { action: 'skill', weight: 2, skillName: '돌격', skillDmgMult: 2.0, hint: '근육에 힘이 실리며 발 끝에 체중을 싣는다...' },
    ],
  },
  aura_elite: {
    id: 'aura_elite', name: 'AURA 특수 요원', emoji: '🔶',
    maxHp: 110, atk: 28, def: 6,
    expReward: 75, goldReward: 100,
    weakTo: 'psychic', staggerMax: 60,
    itemDrop: { itemId: 'recovery_s', chance: 0.3 },
    pattern: [
      { action: 'attack', weight: 4, hint: '짧게 숨을 들이마시며 눈이 당신을 고정한다...' },
      { action: 'skill', weight: 3, skillName: '제압 타격', skillDmgMult: 1.7, debuff: 'stun', hint: '손바닥에 강렬한 빛이 모이며 잠시 멈춘다...' },
      { action: 'defend', weight: 3, hint: '팔짱을 풀고 방어 자세로 전환하는 것처럼 보인다...' },
    ],
  },

  /* ═══ 챕터 보스 ═══ */

  rogue_elite: {
    id: 'rogue_elite', name: '나비 (폭주 각성자)', emoji: '🦋',
    maxHp: 150, atk: 28, def: 3,
    expReward: 100, goldReward: 120,
    isBoss: true, weakTo: 'physical', staggerMax: 120,
    phases: [
      { threshold: 0.6, effect: { type: 'atkUp', amount: 15 } },
    ],
    pattern: [
      { action: 'attack', weight: 5, hint: '흐느끼듯 몸을 떨며 손을 뻗는다...' },
      { action: 'skill', weight: 4, skillName: '혼돈의 날개', skillDmgMult: 1.7, hint: '등 뒤에서 무언가 폭발적으로 펼쳐지려 한다...' },
      { action: 'berserk', weight: 3, hint: '고통에 찬 비명과 함께 모든 것이 흔들린다...' },
    ],
    description: '능력 폭주로 이성을 잃은 젊은 각성자.',
    introText: '"...멈추고 싶어. 그런데 멈출 수가 없어."',
  },
  nexus_operative: {
    id: 'nexus_operative', name: '야차 (오라클 연계 요원)', emoji: '🐉',
    maxHp: 220, atk: 40, def: 5,
    expReward: 150, goldReward: 170,
    isBoss: true, weakTo: 'nature', staggerMax: 150,
    phases: [
      { threshold: 0.6, effect: { type: 'regen', amount: 100 } },
    ],
    pattern: [
      { action: 'attack', weight: 4, hint: '턱을 당기고 양 주먹을 꽉 쥔다...' },
      { action: 'skill', weight: 4, skillName: '강철 주먹', skillDmgMult: 1.0, hits: 2, hint: '양손 관절에서 소리가 울리며 리듬감 있게 몸을 흔든다...' },
      { action: 'skill', weight: 3, skillName: '맹돌진', skillDmgMult: 2.2, hint: '이를 악물며 발밑 바닥이 미세하게 흔들린다...' },
    ],
    description: '오라클의 지시를 받는 강력한 근접 전투 능력자.',
    introText: '"더는 못 가게 할 거야. 여기서 끝내지."',
  },
  oracle_commander: {
    id: 'oracle_commander', name: '가시 (오라클 간부)', emoji: '🌹',
    maxHp: 320, atk: 55, def: 7,
    expReward: 200, goldReward: 220,
    isBoss: true, weakTo: 'physical', staggerMax: 180,
    phases: [
      { threshold: 0.7, effect: { type: 'regen', amount: 120 } },
      { threshold: 0.4, effect: { type: 'atkUp', amount: 25 } },
    ],
    pattern: [
      { action: 'attack', weight: 3, hint: '우아하게 손을 들어 올리며 시선을 당신에게 고정한다...' },
      { action: 'skill', weight: 4, skillName: '가시 파열', skillDmgMult: 2.0, debuff: 'fear', hint: '공기 중에 날카로운 것들이 맴도는 느낌이 든다...' },
      { action: 'skill', weight: 3, skillName: '공포의 장막', skillDmgMult: 0, debuff: 'stun', hint: '입꼬리를 올리며 낮고 부드러운 목소리로 무언가를 속삭인다...' },
      { action: 'defend', weight: 1, hint: '여유롭게 뒤로 물러서며 품위 있게 자세를 잡는다...' },
    ],
    description: '오라클 조직의 핵심 간부. 공포를 무기로 다루는 정신계 능력자.',
    introText: '"오라클의 이상을 막으려는 건가. 네가 얼마나 버티나 보지."',
  },

  /* ═══ 중간 보스 ═══ */

  aura_captain: {
    id: 'aura_captain', name: 'AURA 기동대장', emoji: '🎖️',
    maxHp: 350, atk: 55, def: 9,
    expReward: 160, goldReward: 200,
    itemDrop: { itemId: 'reinforced_suit', chance: 0.5 },
    isBoss: true, weakTo: 'psychic', staggerMax: 190,
    phases: [
      { threshold: 0.6, effect: { type: 'atkUp', amount: 12 } },
    ],
    pattern: [
      { action: 'attack', weight: 5, hint: '군인처럼 정확하게 발을 내딛으며 거리를 좁힌다...' },
      { action: 'skill', weight: 4, skillName: '제압 충격', skillDmgMult: 1.6, debuff: 'stun', hint: '손바닥에 강렬한 에너지를 집중시키며 잠시 멈춘다...' },
      { action: 'defend', weight: 1, hint: '방어막을 치듯 팔을 앞으로 내밀고 자세를 낮춘다...' },
    ],
    description: 'AURA 기동대의 현장 지휘관. 반역자를 처리하기 위해 출동했다.',
    introText: '"요원 신분으로 반역이라니. 직접 처리하겠다."',
  },
  nexus_lieutenant: {
    id: 'nexus_lieutenant', name: 'Nexus 부사령관', emoji: '🔫',
    maxHp: 300, atk: 58, def: 7,
    expReward: 180, goldReward: 220,
    isBoss: true, weakTo: 'nature', staggerMax: 170,
    pattern: [
      { action: 'attack', weight: 4, hint: '방아쇠 손가락이 미세하게 움직인다...' },
      { action: 'skill', weight: 4, skillName: '연속 사격', skillDmgMult: 0.7, hits: 2, hint: '조준선이 빠르게 흔들리며 여러 각도를 훑는다...' },
      { action: 'skill', weight: 3, skillName: '게릴라 전술', skillDmgMult: 2.2, hint: '순간적으로 시야에서 사라지듯 몸을 기울인다...' },
    ],
    description: 'Nexus의 전술 지휘관.',
    introText: '"AURA의 개가 됐군. 여기서 끝이야."',
  },
  jiyu_boss: {
    id: 'jiyu_boss', name: '지유 (Ji-Yu)', emoji: '🗡️',
    maxHp: 420, atk: 65, def: 11,
    expReward: 280, goldReward: 0,
    isBoss: true, weakTo: 'nature', staggerMax: 210,
    pattern: [
      { action: 'attack', weight: 4, hint: '익숙한 눈빛으로 당신의 허점을 찾는다...' },
      { action: 'skill', weight: 4, skillName: '정밀 타격', skillDmgMult: 1.9, hint: '숨을 느리게 내쉬며 한 점에 모든 집중을 쏟는다...' },
      { action: 'skill', weight: 2, skillName: '방어 충격', skillDmgMult: 1.5, hint: '방어를 뚫으려는 듯 각도를 계산하며 중심을 이동한다...' },
      { action: 'defend', weight: 1, hint: '눈을 감았다 뜨며 조용히 당신의 다음 행동을 기다린다...' },
    ],
    description: 'AURA 선임 요원. 당신의 동료였던 사람.',
    introText: '"...선택한 거잖아. 나도 막아야 해."',
    uniqueDialogue: true,
  },
  kai_boss: {
    id: 'kai_boss', name: '카이 (Kai)', emoji: '⚡',
    maxHp: 400, atk: 65, def: 8,
    expReward: 280, goldReward: 0,
    isBoss: true, weakTo: 'physical', staggerMax: 200,
    pattern: [
      { action: 'attack', weight: 4, hint: '손가락 사이에서 파직파직 소리가 새어 나온다...' },
      { action: 'skill', weight: 4, skillName: '전기 폭발', skillDmgMult: 2.0, hint: '머리카락이 곤두서고 공기가 따갑게 느껴진다...' },
      { action: 'skill', weight: 3, skillName: '충전 방전', skillDmgMult: 2.5, hint: '온몸이 번쩍이며 천천히 두 팔을 벌린다...' },
    ],
    description: 'Nexus 연락책. 전기 능력자.',
    introText: '"배신자. 내 손으로 끝낼게."',
    uniqueDialogue: true,
  },

  /* ═══ 최종 보스 ═══ */

  echo: {
    id: 'echo', name: 'Echo (Nexus 수장)', emoji: '🌑',
    maxHp: 550, atk: 80, def: 14,
    expReward: 350, goldReward: 0,
    isFinalBoss: true, weakTo: 'physical', staggerMax: 250,
    phases: [
      { threshold: 0.7, effect: { type: 'regen', amount: 200 } },
      { threshold: 0.4, effect: { type: 'atkUp', amount: 30 } },
    ],
    pattern: [
      { action: 'attack', weight: 3, hint: '공간 자체가 눌리는 듯한 압박이 밀려온다...' },
      { action: 'skill', weight: 4, skillName: '공명 파동', skillDmgMult: 2.2, hint: '주변의 빛이 일그러지며 허공에 파문이 퍼진다...' },
      { action: 'skill', weight: 3, skillName: '집단 세뇌', skillDmgMult: 0, debuff: 'fear', hint: '눈동자가 빛을 잃으며 목소리 없는 말이 머릿속에 울린다...' },
      { action: 'skill', weight: 1, skillName: '공명 폭발', skillDmgMult: 3.5, hint: '세상 전체가 숨을 죽이는 것 같은 침묵이 찾아온다...' },
    ],
    description: 'Nexus를 이끄는 수장. 초능력자의 인류 지배를 꿈꾸는 광신자.',
    introText: '"자유란 강자가 지배하는 것. 인간은 이미 시대에 뒤처졌어."',
  },
  director_kang: {
    id: 'director_kang', name: '강 국장 (AURA 총책임자)', emoji: '👔',
    maxHp: 500, atk: 72, def: 18,
    expReward: 350, goldReward: 0,
    isFinalBoss: true, weakTo: 'psychic', staggerMax: 230,
    phases: [
      { threshold: 0.6, effect: { type: 'regen', amount: 160 } },
      { threshold: 0.4, effect: { type: 'atkUp', amount: 20 } },
    ],
    pattern: [
      { action: 'attack', weight: 3, hint: '넥타이를 고쳐 매며 차갑게 당신을 내려다본다...' },
      { action: 'skill', weight: 4, skillName: '능력 억제 필드', skillDmgMult: 0, debuff: 'suppressed', hint: '무언가 보이지 않는 그물이 주변 공기를 조여드는 느낌이 든다...' },
      { action: 'skill', weight: 3, skillName: '전술 공격', skillDmgMult: 2.0, hint: '수십 년의 경험으로 다져진 눈이 빈틈을 정확히 포착한다...' },
      { action: 'skill', weight: 1, skillName: '최후 명령', skillDmgMult: 3.0, hint: '마지막 수단을 쓰기로 결심한 듯 표정이 굳어진다...' },
    ],
    description: '프로젝트 AURA의 총책임자. 쿠데타를 획책하는 부패한 권력자.',
    introText: '"통제를 거부하는 자는 위협이다. 오래전부터 알고 있었어."',
  },
};
