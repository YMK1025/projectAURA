/* ─── Chapter 1: 첫 번째 접촉 ─── */
export const chapter1 = {
  id: 'ch1',
  title: '첫 번째 접촉',
  nodes: [

    {
      id: 'ch1_s0', type: 'story',
      title: '세계의 균열',
      text: `2035년 서울. 도시는 오늘도 쉼 없이 돌아간다.\n\n당신은 출근길 지하철 안에 있다. 손잡이를 잡은 채 반쯤 졸고 있을 때였다.\n\n갑자기 열차가 멈춘다. 터널 한가운데서. 불이 깜박이고, 스피커에서 잡음이 터진다. 그 순간—\n\n머릿속에서 무언가가 '열린다'. 주변 모든 것이 선명하게, 아프도록 선명하게 보이기 시작한다.\n\n그것이 시작이었다.`,
      choices: [
        { text: '자신을 진정시키며 평범하게 행동한다', next: 'ch1_s1', faction: 5  },
        { text: '능력이 무엇인지 파악하려 집중한다',   next: 'ch1_s1', faction: 0  },
        { text: '충동을 손을 꽉 쥐며 억제한다',        next: 'ch1_s1', faction: -5 },
      ],
    },

    {
      id: 'ch1_s1', type: 'story',
      title: '프로젝트 AURA',
      text: `퇴근 무렵, 낯선 여자가 엘리베이터 앞에서 기다리고 있다. 짧은 머리카락, 날카로운 눈매.\n\n"각성하셨군요. 저희가 기다리고 있었습니다."\n\n그녀의 이름은 **지유(Ji-Yu)**. 프로젝트 AURA의 선임 요원이다. 을지로의 오래된 건물 지하. 겉보기엔 낡은 창고지만 안으로 들어서자 최첨단 장비가 가득하다.\n\n"세상에는 두 종류의 사람이 있어요. 초능력이 없는 사람과, 아직 각성하지 못한 사람. 당신은 방금 그 경계를 넘었습니다."`,
      choices: [
        { text: '"합류하겠습니다."',              next: 'ch1_combat1', faction: 15, relation: { jiyu: 10 }, setFlag: ['helped_aura_ch1', 'bonded_jiyu'] },
        { text: '"조직에 대해 더 알고 싶습니다."', next: 'ch1_combat1', faction: 5,  relation: { jiyu: 5  }, setFlag: 'helped_aura_ch1' },
        { text: '"...일단 지켜보죠."',             next: 'ch1_combat1', faction: 0,  relation: { jiyu: 2  } },
      ],
    },

    /* 전투 1: 기지 침입자 */
    {
      id: 'ch1_combat1', type: 'combat',
      title: '침입자 처리',
      preText: '기지에 합류한 지 이틀째, 낯선 침입자가 기지에 나타났다.\n\n지유가 차갑게 말한다. "실전 경험을 쌓을 기회군요."',
      enemies: ['aura_guard'],
      goldReward: 60,
      onWin:  'ch1_s1b',
      onLose: 'gameover',
    },

    /* 전투 2: Nexus 감시 요원 */
    {
      id: 'ch1_s1b', type: 'story',
      title: 'Nexus의 시선',
      text: `침입자를 처리한 직후, 기지 외부 감시 카메라에 수상한 인물이 잡힌다.\n\n"Nexus 요원이에요." 지유가 긴장한 목소리로 말한다. "우리 기지를 감시하고 있었어요. 처리해야 합니다."`,
      choices: [
        { text: '"제가 하겠습니다."',    next: 'ch1_combat1b', faction: 10 },
        { text: '"지유와 함께 가자."',   next: 'ch1_combat1b', faction: 5  },
        { text: '"왜 우릴 감시하는 거지?"', next: 'ch1_combat1b', faction: -5, relation: { kai: 3 } },
      ],
    },

    {
      id: 'ch1_combat1b', type: 'combat',
      title: 'Nexus 감시 요원',
      preText: '기지 외벽 골목. 후드를 깊게 눌러쓴 요원이 도주를 시도한다.\n\n"잡아야 해요." 지유가 앞서 달린다.',
      enemies: ['nexus_agent'],
      goldReward: 70,
      onWin:  'ch1_random1',
      onLose: 'gameover',
    },

    {
      id: 'ch1_random1', type: 'random_event',
      pool: ['re_lost_citizen', 're_aura_supply_drop', 're_training_opportunity', 're_focus_session'],
      next: 'ch1_event1',
    },

    {
      id: 'ch1_event1', type: 'event',
      title: '수상한 메시지',
      text: `늦은 밤, 당신의 단말기에 익명 메시지가 도착한다.\n\n*"AURA가 진실을 말하고 있다고 생각하세요? — K"*\n\n메시지 발신지는 추적 불가. 서명은 단 한 글자: K.`,
      choices: [
        { text: '지유에게 보고한다',       next: 'ch1_shop1', faction: 10,  relation: { jiyu: 8  }, setFlag: 'helped_aura_ch1', resultText: '지유가 눈살을 찌푸린다. "무시하세요. 공작입니다."' },
        { text: '혼자 조사해보기로 한다',  next: 'ch1_shop1', faction: -10, relation: { kai: 5  }, setFlag: 'helped_nexus_ch1', resultText: '메시지를 저장해 두었다. 뭔가 숨겨진 게 있다.' },
        { text: '답장을 보낸다: "누구냐"', next: 'ch1_shop1', faction: -15, relation: { kai: 15 }, setFlag: ['helped_nexus_ch1', 'bonded_kai'], resultText: '몇 분 후 답장이 왔다. "곧 알게 돼요. — K"' },
      ],
    },

    {
      id: 'ch1_shop1', type: 'shop',
      title: 'AURA 보급소',
      shopId: 'aura_supply',
      text: 'AURA 기지의 장비 보급소. 지유가 소개해 준 곳이다.',
      next: 'ch1_s2',
    },

    {
      id: 'ch1_s2', type: 'story',
      title: '폭주 신호',
      text: `보급소를 나서려는 순간, 기지 내 경보가 울린다.\n\n"마포구 일대에서 폭주 각성자 2명이 민간인을 위협하고 있습니다!"\n\n리온 교관이 당신을 바라본다. "훈련이 끝났죠. 실전으로 가죠."\n\n지유가 낮게 말한다. "저들은 도움이 필요한 거야. 제압은 하되, 다치지 않게."`,
      choices: [
        { text: '"바로 출동합니다."',             next: 'ch1_combat2', faction: 5  },
        { text: '"잠깐, 상황 파악부터 하죠."',   next: 'ch1_combat2', faction: 0  },
        { text: '"저들이 왜 폭주하는지가 먼저야."', next: 'ch1_combat2', faction: -10, relation: { kai: 5 } },
      ],
    },

    /* 전투 3: 폭주 각성자 */
    {
      id: 'ch1_combat2', type: 'combat',
      title: '폭주 각성자 진압',
      preText: '마포구 골목길. 두 명의 청년이 제어를 잃은 채 날뛰고 있다.\n\n주변 유리창이 산산이 부서지고 있다. 민간인들이 비명을 지르며 달아난다.',
      enemies: ['rogue_awakened', 'rogue_awakened'],
      goldReward: 90,
      onWin:  'ch1_combat2b',
      onLose: 'gameover',
    },

    /* 전투 4: 나비 접근을 막으려는 오라클 */
    {
      id: 'ch1_combat2b', type: 'combat',
      title: '오라클의 그림자',
      preText: '폭주자들을 진정시키는 사이, 골목 저편에서 또 다른 무리가 나타난다.\n\n로브를 걸친 자들이 폭주한 각성자를 데려가려 한다. 오라클이다.\n\n"막아야 해요." 지유가 즉시 자세를 잡는다.',
      enemies: ['oracle_follower', 'oracle_follower'],
      goldReward: 100,
      onWin:  'ch1_s3',
      onLose: 'gameover',
    },

    {
      id: 'ch1_s3', type: 'story',
      title: '나비',
      text: `오라클을 쫓아낸 뒤, 신호가 300미터 옥상에서 잡힌다.\n\n옥상에 도착하자, 한 소녀가 서 있다. 열일곱 살쯤 돼 보이는 앳된 얼굴.\n\n그녀의 등 뒤로 빛이 흩날린다. 나비 날개처럼.\n\n"...멈추고 싶어. 그런데 멈출 수가 없어."`,
      choices: [
        { text: '"괜찮아. 우리가 도와줄게."',         next: 'ch1_boss', faction: 5,  relation: { jiyu: 3 }, setFlag: 'helped_aura_ch1' },
        { text: '"능력을 풀어. 그럼 다 끝나."',        next: 'ch1_boss', faction: 0  },
        { text: '"...AURA가 아닌 다른 방법이 있어."', next: 'ch1_boss', faction: -5, relation: { kai: 5 }, setFlag: ['helped_nexus_ch1', 'bonded_kai'] },
      ],
    },

    /* 보스 */
    {
      id: 'ch1_boss', type: 'combat',
      title: '폭주하는 나비',
      preText: '"멈추고 싶은데... 몸이 말을 안 들어!"\n\n소녀의 능력이 폭발하듯 퍼진다. 선택의 여지가 없다. 제압해야 한다.',
      enemies: ['rogue_elite'],
      goldReward: 120,
      onWin:  'ch2_s0',
      onLose: 'gameover',
    },
  ],
};
