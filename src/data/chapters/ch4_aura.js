/* ─── Chapter 4 (AURA Path): 내부의 적 ─── */
export const chapter4_aura = {
  id: 'ch4_aura',
  title: '내부의 적 — AURA의 길',
  nodes: [

    /* 4A-1. AURA 합류 직후 */
    {
      id: 'ch4a_s0', type: 'story',
      title: '내부에서',
      text: `지유와 함께 기지 심부로 이동했다. 카이의 뒷모습이 시야에서 사라진다.\n\n지유가 말한다. "잘 선택했어요. AURA 내부에도 부패가 있어요. 하지만 안에서 바꾸는 게 더 실질적입니다."\n\n"그리고 — Echo에 대해 알아야 할 게 있어요."\n\nEcho. Nexus의 지도자. 그런데 지유의 표정이 이상하다.`,
      choices: [
        { text: '"Echo가 뭔데요?"',                 next: 'ch4a_s1', faction: 5  },
        { text: '"카이가 걱정되긴 하는데..."',        next: 'ch4a_s1', faction: -5, relation: { kai: 5 } },
        { text: '"먼저 AURA 내부를 정리합시다."',   next: 'ch4a_s1', faction: 10 },
      ],
    },

    /* 4A-2. Echo의 변질 */
    {
      id: 'ch4a_s1', type: 'story',
      title: 'Echo의 그림자',
      text: `"Echo는 처음에는 각성자의 자유를 위해 싸운 사람이었어요." 지유가 파일을 펼친다.\n\n"하지만 최근 6개월. Nexus가 변했습니다. 무고한 각성자들을 강제로 세뇌해 세력을 키우고 있어요. 오라클과 다를 게 없이."\n\n"Echo는 이제 초능력자가 인간 세계를 지배해야 한다고 믿어요. 자유가 아니라 지배."\n\n당신은 처음으로 카이의 선택이 어떤 결과를 낳을지 걱정이 된다.`,
      choices: [
        { text: '"카이는 그걸 모르고 있을 거야."',   next: 'ch4a_combat1', faction: 0, relation: { kai: 5 } },
        { text: '"Echo를 막아야 합니다."',            next: 'ch4a_combat1', faction: 10 },
        { text: '"오라클도 막고 Echo도 막아야 하는군요."', next: 'ch4a_combat1', faction: 5  },
      ],
    },

    /* 4A-3. 카이와의 전투 */
    {
      id: 'ch4a_combat1', type: 'combat',
      title: '동료였던 자',
      preText: 'AURA 기지 외곽. 카이가 기다리고 있었다.\n\n"...그래. 선택했군." 그의 손에서 전기가 튀는다. "막을 수밖에 없어."',
      enemies: ['kai_boss'],
      goldReward: 200,
      onWin:  'ch4a_rest1',
      onLose: 'gameover',
    },

    /* 4A-4. 결의 */
    {
      id: 'ch4a_rest1', type: 'rest',
      title: '결의',
      text: '카이를 제압했다. 지유가 상처를 치료해준다.\n\n"잘 선택했어요. 우리가 안에서 바꿀 수 있어요." 그녀의 눈엔 믿음이 있다.\n\n하지만 카이의 마지막 말이 머릿속에 남는다. "Echo를 막아. 그게 진짜 위협이야."',
      restAmount: { hp: 300, mp: 200 },
      next: 'ch4a_shop1',
    },

    /* 4A-5. 상점 */
    {
      id: 'ch4a_shop1', type: 'shop',
      title: 'AURA 고급 보급소',
      shopId: 'aura_supply',
      text: '지유가 고급 장비 접근 권한을 열어준다. "최종 작전을 위해 준비하세요."',
      next: 'ch5_aura_s0',
    },
  ],
};
