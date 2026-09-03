/* ─── Chapter 4 (AURA Path): 내부의 적 ─── */
export const chapter4_aura = {
  id: 'ch4_aura',
  title: '내부의 적 — AURA의 길',
  nodes: [

    {
      id: 'ch4a_s0', type: 'story',
      title: '내부에서',
      text: `지유와 함께 기지 심부로 이동했다. 카이의 뒷모습이 시야에서 사라진다.\n\n지유가 말한다. "잘 선택했어요. AURA 내부에도 부패가 있어요. 하지만 안에서 바꾸는 게 더 실질적입니다."\n\n"그리고 — Echo에 대해 알아야 할 게 있어요."\n\nEcho. Nexus의 지도자. 그런데 지유의 표정이 이상하다.`,
      choices: [
        { text: '"Echo가 뭔데요?"',                 next: 'ch4a_s1', faction: 5  },
        { text: '"카이가 걱정되긴 하는데..."',        next: 'ch4a_s1', faction: -5, relation: { kai: 5 } },
        { text: '"먼저 AURA 내부를 정리합시다."',   next: 'ch4a_s1', faction: 10 },
        { text: '[과거 회상] "처음부터 AURA를 믿었으니까요." — 지유에게 신뢰를 전한다', next: 'ch4a_s1', faction: 15, relation: { jiyu: 12 }, requireFlag: 'helped_aura_ch1', resultText: '지유가 잠깐 멈추더니 조용히 웃는다. "그때부터 알아봤어요. 당신이 같은 편이라는 걸."' },
        { text: '[인연] "지유, 당신이 있어서 여기까지 올 수 있었어요." — 진심을 전한다', next: 'ch4a_s1', faction: 10, relation: { jiyu: 15 }, requireFlag: 'bonded_jiyu', resultText: '지유의 눈빛이 흔들린다. "...저도 같은 생각이에요." 그녀가 조용히 말한다.' },
      ],
    },

    {
      id: 'ch4a_s1', type: 'story',
      title: 'Echo의 그림자',
      text: `"Echo는 처음에는 각성자의 자유를 위해 싸운 사람이었어요." 지유가 파일을 펼친다.\n\n"하지만 최근 6개월. Nexus가 변했습니다. 무고한 각성자들을 강제로 세뇌해 세력을 키우고 있어요."\n\n"Echo는 이제 초능력자가 인간 세계를 지배해야 한다고 믿어요. 그를 막지 않으면 Nexus는 오라클보다 더 위험한 조직이 돼요."\n\n그 때, 외곽 경보가 울린다. Nexus 요원들이 기지로 접근 중이다.`,
      choices: [
        { text: '"카이는 그걸 모르고 있을 거야."',   next: 'ch4a_combat0b', faction: 0, relation: { kai: 5 } },
        { text: '"Echo를 막아야 합니다."',            next: 'ch4a_combat0b', faction: 10 },
        { text: '"먼저 들어오는 자들부터."',          next: 'ch4a_combat0b', faction: 5  },
      ],
    },

    /* 전투 4 (분기): Nexus 선발대 */
    {
      id: 'ch4a_combat0b', type: 'combat',
      title: 'Nexus 선발대',
      preText: 'AURA 기지 외곽. Nexus 정예 요원들이 기지를 압박하고 있다.\n\n"카이의 명령인지는 모르겠지만 — 막아야 해요." 지유가 자세를 잡는다.',
      enemies: ['nexus_elite', 'nexus_agent'],
      goldReward: 180,
      onWin:  'ch4a_combat1',
      onLose: 'gameover',
    },

    /* 보스: 카이 */
    {
      id: 'ch4a_combat1', type: 'combat',
      title: '동료였던 자',
      preText: 'AURA 기지 외곽. 카이가 기다리고 있었다.\n\n"...그래. 선택했군." 그의 손에서 전기가 튀는다. "막을 수밖에 없어."',
      enemies: ['kai_boss'],
      goldReward: 200,
      onWin:  'ch4a_random1',
      onLose: 'gameover',
    },

    {
      id: 'ch4a_random1', type: 'random_event',
      pool: ['re_aura_insider', 're_overload_push', 're_shortcut_tunnel', 're_abandoned_cache', 're_crossroads_choice'],
      next: 'ch4a_shop1',
    },

    {
      id: 'ch4a_shop1', type: 'shop',
      title: 'AURA 고급 보급소',
      shopId: 'aura_supply',
      text: '지유가 고급 장비 접근 권한을 열어준다. "최종 작전을 위해 준비하세요."',
      next: 'ch5_aura_s0',
    },
  ],
};
