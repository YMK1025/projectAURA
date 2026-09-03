/* ─── Chapter 5 (AURA Path): 정점 ─── */
export const chapter5_aura = {
  id: 'ch5_aura',
  title: '정점 — AURA의 길',
  nodes: [

    {
      id: 'ch5_aura_s0', type: 'story',
      title: 'Echo를 향해',
      text: `지유가 작전 지도를 펼친다.\n\n"Echo. Nexus의 지도자. 실명 불명, 외모 불명. 알려진 것은 하나 — 강력한 정신조작 능력으로 수십 명의 각성자를 세뇌했다는 것."\n\n"더 나쁜 소식이 있어요. Echo가 **오라클**과 손을 잡았습니다. 초능력자로 인류를 지배하겠다는 목표가 같았던 거예요."\n\n당신은 깊게 숨을 들이마신다. 자유를 외치던 자가 지배를 꿈꾸는 자가 됐다.`,
      choices: [
        { text: '"어디 있습니까"',                           next: 'ch5_aura_combat0', faction: 10 },
        { text: '"카이가 이걸 알면 어떻게 반응할까요?"',    next: 'ch5_aura_combat0', faction: 0, relation: { kai: 5 } },
        { text: '"후회는 없습니다. 갑시다."',               next: 'ch5_aura_combat0', faction: 5  },
      ],
    },

    /* 전투 1: 외곽 돌파 */
    {
      id: 'ch5_aura_combat0', type: 'combat',
      title: '거점 외곽 돌파',
      preText: '인천 외곽 폐공장 외벽. Nexus 요원들이 경계선을 치고 있다.\n\n"외곽부터 뚫어요." 지유가 앞장선다.',
      enemies: ['nexus_agent', 'nexus_agent'],
      goldReward: 150,
      onWin:  'ch5_aura_combat1',
      onLose: 'gameover',
    },

    /* 전투 2: 거점 내부 */
    {
      id: 'ch5_aura_combat1', type: 'combat',
      title: 'Nexus-오라클 연합 거점',
      preText: '거점 내부. Nexus 요원들과 오라클 추종자들이 함께 방어선을 치고 있다.\n\n"연합했군요." 지유가 이를 간다.',
      enemies: ['nexus_agent', 'oracle_follower'],
      goldReward: 170,
      onWin:  'ch5_aura_event1',
      onLose: 'gameover',
    },

    {
      id: 'ch5_aura_event1', type: 'event',
      title: '세뇌의 흔적',
      text: `거점 내부. 쓰러진 Nexus 요원들 사이에 멍한 눈빛의 각성자들이 있다. 세뇌 상태.\n\n지유가 빠르게 치료팀을 부른다. "이들은 피해자예요. Echo의 능력으로 조종당한 겁니다."\n\n그 중 한 명이 희미하게 말한다. "...Echo는... 지하에 있어요... 여기 지하..."`,
      choices: [
        { text: '부상자를 먼저 후송시킨다', next: 'ch5_aura_s1', faction: 10, relation: { jiyu: 5 }, resultText: '"감사합니다." 지유가 조용히 말했다.' },
        { text: '정보를 더 캐낸 후 전진한다', next: 'ch5_aura_s1', faction: 0, resultText: '"지하 3층. 방호 능력 최대화 상태." 그는 더 이상 말하지 못했다.' },
      ],
    },

    {
      id: 'ch5_aura_s1', type: 'story',
      title: '오라클의 전위대',
      text: `지하로 향하는 통로. Echo가 오라클의 정예 요원을 경호대로 배치해 놓았다.\n\n지유가 낮게 말한다. "오라클과 Echo의 결합 — 정신 조작 능력자들의 연합이에요. 우리 둘이 버텨야 해요."`,
      choices: [
        { text: '"같이 돌파하죠."',                 next: 'ch5_aura_combat1b', faction: 5 },
        { text: '"오라클 요원들은 자기 의지가 있어."', next: 'ch5_aura_combat1b', faction: 0 },
        { text: '"선제 기습이 유리해요."',           next: 'ch5_aura_combat1b', faction: 5 },
      ],
    },

    /* 전투 3: 오라클 경호 */
    {
      id: 'ch5_aura_combat1b', type: 'combat',
      title: '지하 진입 전 경호대',
      preText: '지하 1층 계단. 오라클 전투 요원들이 진입로를 막고 있다.\n\n"통과시켜 줄 것 같아?" 요원이 비웃는다.',
      enemies: ['oracle_agent', 'oracle_follower'],
      goldReward: 200,
      onWin:  'ch5_aura_combat2',
      onLose: 'gameover',
    },

    /* 전투 4: 부사령관+요원 */
    {
      id: 'ch5_aura_combat2', type: 'combat',
      title: 'Echo의 최후 경호대',
      preText: '지하 2층 통로. Nexus 부사령관이 길을 막는다.\n\n"여기까지야. Echo를 만나려면 내 시체를 밟고 가."',
      enemies: ['nexus_lieutenant', 'oracle_agent'],
      goldReward: 260,
      onWin:  'ch5_aura_rest1',
      onLose: 'gameover',
    },

    {
      id: 'ch5_aura_rest1', type: 'rest',
      title: '마지막 준비',
      text: '지유가 응급 처치를 한다.\n\n"다음이 마지막이에요. Echo의 능력은 공간에 영향을 미칩니다. 의지를 잃지 마세요."\n\n그녀가 당신의 어깨에 손을 얹는다. "끝내고 돌아와요."',
      restAmount: { hp: 400, mp: 300 },
      next: 'ch5_aura_boss',
    },

    {
      id: 'ch5_aura_boss', type: 'story',
      title: 'Echo',
      text: `지하 최심층. 빛 한 줄기 없는 공간.\n\n"왔군요."\n\n목소리는 사방에서 들린다. 어디서 오는지 알 수 없다.\n\n"AURA를 택했다고 했나요? 그들이 당신을 처분 대상에 올렸는데도?"\n\n어둠 속에서 형체가 나타난다. 놀랍도록 평범한 얼굴.\n\n"자유란 강자가 지배하는 것. 인간은 이미 시대에 뒤처졌어. 우리가 이끌어야 해."`,
      choices: [
        { text: '"변명은 됐어."',                                     next: 'ch5_aura_final', faction: 10 },
        { text: '"그래도 세뇌는 용납할 수 없다."',                   next: 'ch5_aura_final', faction: 5  },
        { text: '"...당신이 옳을 수도 있어. 그래도 막아야 해."',     next: 'ch5_aura_final', faction: 0  },
      ],
    },

    /* 최종 보스 */
    {
      id: 'ch5_aura_final', type: 'combat',
      title: 'Echo 최종전',
      preText: '"당신이 원한다면." Echo의 눈이 빛난다. "느껴보세요 — 내가 왜 이걸 선택했는지."',
      enemies: ['echo'],
      goldReward: 0,
      onWin:  'ending_aura',
      onLose: 'gameover',
    },
  ],
};
