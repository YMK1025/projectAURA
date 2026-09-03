/* ─── Chapter 2: 수련 ─── */
export const chapter2 = {
  id: 'ch2',
  title: '수련',
  nodes: [

    /* 2-1. 훈련 시작 */
    {
      id: 'ch2_s0', type: 'story',
      image: null,
      title: '통제와 해방 사이',
      text: `교관 **리온(Leon)**이 홀로그램 타깃 앞에 당신을 세운다.\n\n"능력은 근육과 같습니다. 쓸수록 강해지지만, 제어하지 못하면 자신을 찢어버립니다."\n\n훈련실 한쪽엔 동기 요원 **민(Min)**도 있다. 스물다섯의 전기 능력자. 거친 말투 뒤로 순수한 열정이 보인다.`,
      choices: [
        { text: '"한계까지 밀어붙이겠습니다."', next: 'ch2_combat1', statChanges: { power: 4, control: -1 }, faction: -5 },
        { text: '"제어력을 먼저 키우겠습니다."', next: 'ch2_combat1', statChanges: { control: 4, mental: 1  }, faction: 10 },
        { text: '"균형을 찾겠습니다."',         next: 'ch2_combat1', statChanges: { power: 2, control: 2, mental: 2 }, faction: 0 },
      ],
    },

    /* 2-2. 훈련 전투 (드론 x2) */
    {
      id: 'ch2_combat1', type: 'combat',
      image: null,
      title: '훈련 드론 격파',
      preText: '오작동한 훈련 드론 두 대가 당신을 향해 돌진한다.\n\n"0.3초 안에 반응해야 합니다." 리온의 목소리는 냉정하다.',
      enemies: ['aura_guard', 'aura_guard'],
      goldReward: 80,
      onWin:  'ch2_event1',
      onLose: 'gameover',
    },

    /* 2-3. 이벤트: 카이와 비밀 접촉 */
    {
      id: 'ch2_event1', type: 'event',
      image: null,
      title: '기지 아래의 목소리',
      text: `훈련 종료 후 혼자 복도를 걷다 낯선 남자와 마주친다.\n\n머리카락을 반쯤 가린 후드, 전기가 튀는 듯한 눈빛. 그가 조용히 말한다.\n\n"나는 **카이(Kai)**예요. 메시지 받았죠?"\n\n"AURA가 숨기는 게 있어요. 지금 당장은 믿지 않아도 돼요 — 하지만 눈을 뜨고 다니세요."`,
      choices: [
        { text: '지유에게 즉시 신고한다',       next: 'ch2_shop1', faction: 15,  relation: { jiyu: 12, kai: -10 }, statChanges: { control: 2 }, resultText: '"잘 했어요." 지유가 고맙다고 했다.' },
        { text: '카이의 말을 새겨듣는다',        next: 'ch2_shop1', faction: -10, relation: { kai: 15           }, statChanges: { mental: 2  }, resultText: '"또 연락할게요." 카이가 사라졌다.' },
        { text: '"증거를 보여주면 믿겠다"',      next: 'ch2_shop1', faction: -5,  relation: { kai: 10           }, statChanges: { mental: 3  }, resultText: '카이가 픽 웃었다. "곧 보게 될 거예요."' },
      ],
    },

    /* 2-4. 상점 */
    {
      id: 'ch2_shop1', type: 'shop',
      image: null,
      title: 'AURA 보급소',
      shopId: 'aura_supply',
      text: '리온이 추가 장비를 챙겨두라고 했다.',
      next: 'ch2_s1',
    },

    /* 2-5. 임무 지령 */
    {
      id: 'ch2_s1', type: 'story',
      image: null,
      title: '첫 임무',
      text: `리온이 파일을 건넨다.\n\n"다음 주부터 현장에 나갑니다."\n\n지유가 옆에서 보충한다. "마포구 일대에서 초능력 각성자 17명이 사라졌어요. 공통점은 하나 — 모두 세뇌된 상태로 발견됐거나, 흔적도 없이 사라졌습니다."`,
      choices: [
        { text: '"바로 출동합시다."',          next: 'ch3_s0', statChanges: { power: 2  }, faction: 5  },
        { text: '"더 알아야 합니다. 정보를."', next: 'ch3_s0', statChanges: { mental: 3 }, faction: 0  },
        { text: '"...그 실종자들, 자발적으로 간 게 아닐까요?"', next: 'ch3_s0', statChanges: { mental: 2 }, faction: -10, relation: { kai: 5 } },
      ],
    },
  ],
};
