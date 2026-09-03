/* ─── Chapter 2: 수련 ─── */
export const chapter2 = {
  id: 'ch2',
  title: '수련',
  nodes: [

    {
      id: 'ch2_s0', type: 'story',
      title: '통제와 해방 사이',
      text: `교관 **리온(Leon)**이 홀로그램 타깃 앞에 당신을 세운다.\n\n"능력은 근육과 같습니다. 쓸수록 강해지지만, 제어하지 못하면 자신을 찢어버립니다."\n\n훈련실 한쪽엔 동기 요원 **민(Min)**도 있다. 스물다섯의 전기 능력자. 거친 말투 뒤로 순수한 열정이 보인다.\n\n나비의 일을 보고 나서인지 — 제어력을 갈고닦아야 한다는 생각이 든다.`,
      choices: [
        { text: '"한계까지 밀어붙이겠습니다."', next: 'ch2_combat1', faction: -5 },
        { text: '"제어력을 먼저 키우겠습니다."', next: 'ch2_combat1', faction: 10 },
        { text: '"균형을 찾겠습니다."',          next: 'ch2_combat1', faction: 0  },
      ],
    },

    /* 전투 1: 훈련 드론 */
    {
      id: 'ch2_combat1', type: 'combat',
      title: '훈련 드론 격파',
      preText: '오작동한 훈련 드론 두 대가 당신을 향해 돌진한다.\n\n"0.3초 안에 반응해야 합니다." 리온의 목소리는 냉정하다.',
      enemies: ['aura_guard', 'aura_guard'],
      goldReward: 80,
      onWin:  'ch2_combat1b',
      onLose: 'gameover',
    },

    /* 전투 2: Nexus 훈련구역 침입 */
    {
      id: 'ch2_combat1b', type: 'combat',
      title: 'Nexus 침입자',
      preText: '훈련이 끝난 직후 경보가 울린다. Nexus 요원 둘이 훈련 구역 담을 넘어 들어왔다.\n\n"데이터를 노리는 겁니다." 리온이 무기를 집어든다. "막아요."',
      enemies: ['nexus_agent', 'nexus_agent'],
      goldReward: 90,
      onWin:  'ch2_skill_learn',
      onLose: 'gameover',
    },

    {
      id: 'ch2_skill_learn', type: 'skill_learn',
      title: '능력 심화',
      text: '훈련을 마친 후 리온이 개인 교습을 진행한다.\n\n"당신의 능력 계열에 맞는 심화 기술을 가르쳐 드리죠."',
      skillByLineage: {
        physical: 'war_cry',
        psychic:  'psychic_scan',
        nature:   'stone_wall',
      },
      next: 'ch2_event1',
    },

    {
      id: 'ch2_event1', type: 'event',
      title: '기지 아래의 목소리',
      text: `훈련 종료 후 혼자 복도를 걷다 낯선 남자와 마주친다.\n\n머리카락을 반쯤 가린 후드, 전기가 튀는 듯한 눈빛. 그가 조용히 말한다.\n\n"나는 **카이(Kai)**예요. 메시지 받았죠?"\n\n"AURA가 숨기는 게 있어요. 지금 당장은 믿지 않아도 돼요 — 하지만 눈을 뜨고 다니세요."`,
      choices: [
        { text: '지유에게 즉시 신고한다',  next: 'ch2_shop1', faction: 15,  relation: { jiyu: 12, kai: -10 }, resultText: '"잘 했어요." 지유가 고맙다고 했다.' },
        { text: '카이의 말을 새겨듣는다', next: 'ch2_shop1', faction: -10, relation: { kai: 15           }, resultText: '"또 연락할게요." 카이가 사라졌다.' },
        { text: '"증거를 보여주면 믿겠다"', next: 'ch2_shop1', faction: -5,  relation: { kai: 10           }, resultText: '카이가 픽 웃었다. "곧 보게 될 거예요."' },
      ],
    },

    {
      id: 'ch2_shop1', type: 'shop',
      title: 'AURA 보급소',
      shopId: 'aura_supply',
      text: '리온이 추가 장비를 챙겨두라고 했다.',
      next: 'ch2_s1',
    },

    {
      id: 'ch2_s1', type: 'story',
      title: '첫 임무',
      text: `리온이 파일을 건넨다.\n\n"다음 주부터 현장에 나갑니다."\n\n지유가 옆에서 보충한다. "마포구 일대에서 초능력 각성자 17명이 사라졌어요. 공통점은 하나 — 모두 세뇌된 상태로 발견됐거나, 흔적도 없이 사라졌습니다."\n\n"주모자로 의심되는 조직이 있어요. **오라클(Oracle)**. 정신조작 능력자들로 이루어진 범죄 집단입니다."`,
      choices: [
        { text: '"바로 출동합시다."',                        next: 'ch2_s2', faction: 5  },
        { text: '"더 알아야 합니다. 정보를."',               next: 'ch2_s2', faction: 0  },
        { text: '"...그 실종자들, 자발적으로 간 게 아닐까요?"', next: 'ch2_s2', faction: -10, relation: { kai: 5 } },
      ],
    },

    {
      id: 'ch2_s2', type: 'story',
      title: '마포구 그림자',
      text: `마포구 홍대 뒷골목. 곳곳에 오라클의 흔적이 보인다.\n\n"세뇌 파동의 잔류 에너지예요." 지유가 스캐너를 들여다본다.\n\n그 때, 골목 저편에서 두 명의 인물이 나타난다. 오라클 추종자들이다. 눈빛이 비어 있다.\n\n그리고 그 옆 — Nexus 요원의 복장을 한 자도 보인다. 오라클과 협력하고 있는 것인가?`,
      choices: [
        { text: '"모두 제압하자."',             next: 'ch2_combat2', faction: 5  },
        { text: '"Nexus와 오라클이 손을 잡았다고?"', next: 'ch2_combat2', faction: 0  },
        { text: '"Nexus 요원에게 먼저 말을 걸자."',  next: 'ch2_combat2', faction: -5, relation: { kai: 5 } },
      ],
    },

    /* 전투 3: 오라클+Nexus 연합 */
    {
      id: 'ch2_combat2', type: 'combat',
      title: '오라클 추종자 제압',
      preText: '대화는 통하지 않는다. 그들은 이미 세뇌 상태다.\n\n적들이 동시에 달려든다.',
      enemies: ['oracle_follower', 'nexus_agent'],
      goldReward: 120,
      onWin:  'ch2_combat2b',
      onLose: 'gameover',
    },

    /* 전투 4: 야차 외곽 경비 */
    {
      id: 'ch2_combat2b', type: 'combat',
      title: '창고 외곽 경비',
      preText: '제압한 Nexus 요원의 단말기를 통해 야차의 거점 위치를 파악했다.\n\n창고 입구. 오라클 추종자들이 경비를 서고 있다.',
      enemies: ['oracle_follower', 'oracle_follower'],
      goldReward: 110,
      onWin:  'ch2_event2',
      onLose: 'gameover',
    },

    {
      id: 'ch2_event2', type: 'event',
      title: '야차의 흔적',
      text: `제압한 Nexus 요원이 정신을 차리며 중얼거린다.\n\n"...야차가... 오라클과 거래를... 각성자를 넘기는 대가로..."\n\n지유가 눈빛을 굳힌다. "야차. Nexus 내부 강경파 요원이에요. 오라클과 연계해서 각성자들을 팔아넘기고 있었던 거군요."\n\n단말기에 신호가 잡힌다. 야차가 창고 안에 있다.`,
      choices: [
        { text: '즉시 추적한다',                 next: 'ch2_boss', faction: 5  },
        { text: '지원을 요청한 후 접근한다',      next: 'ch2_boss', faction: 10 },
        { text: '"야차가 왜 그런 거래를 했는지."', next: 'ch2_boss', faction: -5, relation: { kai: 5 } },
      ],
    },

    /* 보스 */
    {
      id: 'ch2_boss', type: 'combat',
      title: '야차',
      preText: '창고 한복판에서 거구의 남자가 등을 돌리고 서 있다.\n\n"더는 못 가게 할 거야. 여기서 끝내지." 야차가 천천히 돌아선다.',
      enemies: ['nexus_operative'],
      goldReward: 170,
      onWin:  'ch2_rest1',
      onLose: 'gameover',
    },

    {
      id: 'ch2_rest1', type: 'rest',
      title: '임무 귀환',
      text: '야차를 제압했다. 창고 안에서 세뇌된 각성자 8명을 발견해 구출했다.\n\n지유가 처치를 마치며 말한다. "야차는 오라클의 지시를 받은 거예요. 오라클의 배후에는 더 큰 조직이 있어요."\n\n"이 정도면 충분히 성장했어요. 다음 임무로 갑시다."',
      restAmount: { hp: 180, mp: 150 },
      next: 'ch3_s0',
    },
  ],
};
