/* ─── Chapter 1: 첫 번째 접촉 ─── */
export const chapter1 = {
  id: 'ch1',
  title: '첫 번째 접촉',
  nodes: [

    /* 1-1. 지하철 각성 */
    {
      id: 'ch1_s0', type: 'story',
      image: null,
      title: '세계의 균열',
      text: `2035년 서울. 도시는 오늘도 쉼 없이 돌아간다.\n\n당신은 출근길 지하철 안에 있다. 손잡이를 잡은 채 반쯤 졸고 있을 때였다.\n\n갑자기 열차가 멈춘다. 터널 한가운데서. 불이 깜박이고, 스피커에서 잡음이 터진다. 그 순간—\n\n머릿속에서 무언가가 '열린다'. 주변 모든 것이 선명하게, 아프도록 선명하게 보이기 시작한다.\n\n그것이 시작이었다.`,
      choices: [
        { text: '자신을 진정시키며 평범하게 행동한다', next: 'ch1_s1', faction: 5  },
        { text: '능력이 무엇인지 파악하려 집중한다',   next: 'ch1_s1', faction: 0  },
        { text: '충동을 손을 꽉 쥐며 억제한다',        next: 'ch1_s1', faction: -5 },
      ],
    },

    /* 1-2. 지유와 만남 */
    {
      id: 'ch1_s1', type: 'story',
      image: null,
      title: '프로젝트 AURA',
      text: `퇴근 무렵, 낯선 여자가 엘리베이터 앞에서 기다리고 있다. 짧은 머리카락, 날카로운 눈매.\n\n"각성하셨군요. 저희가 기다리고 있었습니다."\n\n그녀의 이름은 **지유(Ji-Yu)**. 프로젝트 AURA의 선임 요원이다. 을지로의 오래된 건물 지하. 겉보기엔 낡은 창고지만 안으로 들어서자 최첨단 장비가 가득하다.\n\n"세상에는 두 종류의 사람이 있어요. 초능력이 없는 사람과, 아직 각성하지 못한 사람. 당신은 방금 그 경계를 넘었습니다."`,
      choices: [
        { text: '"합류하겠습니다."',              next: 'ch1_combat1', faction: 15, relation: { jiyu: 10 } },
        { text: '"조직에 대해 더 알고 싶습니다."', next: 'ch1_combat1', faction: 5,  relation: { jiyu: 5  } },
        { text: '"...일단 지켜보죠."',             next: 'ch1_combat1', faction: 0,  relation: { jiyu: 2  } },
      ],
    },

    /* 1-3. 첫 전투 */
    {
      id: 'ch1_combat1', type: 'combat',
      image: null,
      title: '침입자 처리',
      preText: '기지에 합류한 지 이틀째, 낯선 침입자가 기지에 나타났다.\n\n지유가 차갑게 말한다. "실전 경험을 쌓을 기회군요."',
      enemies: ['aura_guard'],
      goldReward: 60,
      onWin:  'ch1_rest1',
      onLose: 'gameover',
    },

    /* 1-4. 휴식 */
    {
      id: 'ch1_rest1', type: 'rest',
      image: null,
      title: 'AURA 회복 구역',
      text: '기지 내부의 의무실. 전투 후 지유가 회복 시설로 안내한다.\n\n"잘 했어요. 능력을 처음 실전에 쓴 치고는."',
      restAmount: { hp: 150, mp: 120 },
      next: 'ch1_event1',
    },

    /* 1-5. 이벤트: 카이 첫 등장 */
    {
      id: 'ch1_event1', type: 'event',
      image: null,
      title: '수상한 메시지',
      text: `늦은 밤, 당신의 단말기에 익명 메시지가 도착한다.\n\n*"AURA가 진실을 말하고 있다고 생각하세요? — K"*\n\n메시지 발신지는 추적 불가. 서명은 단 한 글자: K.`,
      choices: [
        { text: '지유에게 보고한다',       next: 'ch1_shop1', faction: 10,  relation: { jiyu: 8  }, resultText: '지유가 눈살을 찌푸린다. "무시하세요. 공작입니다."' },
        { text: '혼자 조사해보기로 한다',  next: 'ch1_shop1', faction: -10, relation: { kai: 5  }, resultText: '메시지를 저장해 두었다. 뭔가 숨겨진 게 있다.' },
        { text: '답장을 보낸다: "누구냐"', next: 'ch1_shop1', faction: -15, relation: { kai: 15 }, resultText: '몇 분 후 답장이 왔다. "곧 알게 돼요. — K"' },
      ],
    },

    /* 1-6. 상점 */
    {
      id: 'ch1_shop1', type: 'shop',
      image: null,
      title: 'AURA 보급소',
      shopId: 'aura_supply',
      text: 'AURA 기지의 장비 보급소. 지유가 소개해 준 곳이다.',
      next: 'ch2_s0',
    },
  ],
};
