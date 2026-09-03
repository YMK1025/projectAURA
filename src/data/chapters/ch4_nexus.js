/* ─── Chapter 4 (Nexus Path): 바깥에서 ─── */
export const chapter4_nexus = {
  id: 'ch4_nexus',
  title: '바깥에서 — Nexus의 길',
  nodes: [

    {
      id: 'ch4b_s0', type: 'story',
      title: 'Nexus',
      text: `카이를 따라 빠져나왔다. 지유의 눈빛이 뇌리에 박힌다.\n\n카이가 처음으로 미소 짓는다. "고마워. 믿어줘서."\n\n그가 Nexus의 은신처로 안내한다. 낡은 건물이지만 안에는 각성자들이 가득하다. 젊고, 지쳤고, 그리고 눈빛에 열망이 있다.\n\n"여기가 우리야. AURA에 쫓기는 사람들이 모인 곳."`,
      choices: [
        { text: '"함께 싸울게."',              next: 'ch4b_s1', faction: -5  },
        { text: '"강 국장이 문제군요."',       next: 'ch4b_s1', faction: -10 },
        { text: '"Echo는 어디 있어?"',         next: 'ch4b_s1', faction: -5  },
        { text: '[인연] "카이, 처음부터 믿었어. 우리가 함께라면 바꿀 수 있어." — 굳은 신뢰를 보낸다', next: 'ch4b_s1', faction: -10, relation: { kai: 20 }, requireFlag: 'bonded_kai', resultText: '카이의 눈빛이 잠깐 흔들린다. "...고마워. 그 말, 평생 기억할게." 그가 조용히 웃는다.' },
        { text: '[과거 회상] "AURA 밖의 세계를 처음부터 궁금해했어." — 오래된 의심을 꺼낸다', next: 'ch4b_s1', faction: -15, relation: { kai: 10 }, requireFlag: 'helped_nexus_ch1', statChanges: { mental: 2 }, resultText: '카이가 고개를 끄덕인다. "그게 진짜 각성이야. 의심이 없으면 자유도 없어."' },
      ],
    },

    {
      id: 'ch4b_s1', type: 'story',
      title: '쿠데타의 설계자',
      text: `카이가 기밀 파일을 꺼낸다.\n\n"**강 국장**. AURA의 총책임자. 그가 지금 뭘 하고 있는지 봐."\n\n파일에는 인체실험 기록이 가득하다. 격리된 각성자에게 능력 강화 약물을 투여해 전투 능력을 극대화하는 실험들.\n\n"강 국장은 초능력자를 무기로 만들어 정치 권력을 잡으려 해. 쿠데타 계획이야."\n\n그 때, 은신처 외부 경보가 울린다. AURA 추격대가 위치를 파악했다.`,
      choices: [
        { text: '"일단 막자."',                        next: 'ch4b_combat0b', faction: -5  },
        { text: '"지유에게도 알려야 하지 않을까?"',    next: 'ch4b_combat0b', faction: -5, relation: { jiyu: 5 } },
        { text: '"강 국장을 먼저 막는 게 맞아."',      next: 'ch4b_combat0b', faction: -10 },
      ],
    },

    /* 전투 4 (분기): AURA 추격대 */
    {
      id: 'ch4b_combat0b', type: 'combat',
      title: 'AURA 추격대',
      preText: 'Nexus 은신처 입구. AURA 특수 요원들이 건물을 포위했다.\n\n"여기는 내가 막을게." 카이가 전기를 끌어모으며 말한다.',
      enemies: ['aura_elite', 'aura_guard'],
      goldReward: 180,
      onWin:  'ch4b_combat1',
      onLose: 'gameover',
    },

    /* 보스: 지유 */
    {
      id: 'ch4b_combat1', type: 'combat',
      title: '스승이었던 자',
      preText: 'Nexus 은신처 입구. 지유가 당신 앞을 막아서고 있었다.\n\n"가게 할 수 없어요." 그녀의 목소리는 흔들리지 않는다. "당신이 틀렸어요."',
      enemies: ['jiyu_boss'],
      goldReward: 200,
      onWin:  'ch4b_rest1',
      onLose: 'gameover',
    },

    {
      id: 'ch4b_rest1', type: 'rest',
      title: '탈출',
      text: '지유를 뿌리치고 은신처를 확보했다. 카이가 상처를 치료해준다.\n\n"강 국장의 쿠데타 계획을 막으면 돼. 그러면 AURA의 부패한 구조도 무너질 거야."\n\n그가 잠시 멈춘다. "지유는... 언젠가 이해할 거야."',
      restAmount: { hp: 300, mp: 200 },
      next: 'ch4b_shop1',
    },

    {
      id: 'ch4b_shop1', type: 'shop',
      title: 'Nexus 암시장',
      shopId: 'black_market',
      text: '카이가 Nexus의 무기고를 소개한다. "공식 루트엔 없는 것들이야."',
      next: 'ch5_nexus_s0',
    },
  ],
};
