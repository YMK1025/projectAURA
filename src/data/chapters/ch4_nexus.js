/* ─── Chapter 4 (Nexus Path): 바깥에서 ─── */
export const chapter4_nexus = {
  id: 'ch4_nexus',
  title: '바깥에서 — Nexus의 길',
  nodes: [

    /* 4B-1. Nexus 합류 직후 */
    {
      id: 'ch4b_s0', type: 'story',
      title: 'Nexus',
      text: `카이를 따라 빠져나왔다. 지유의 눈빛이 뇌리에 박힌다. 실망인지, 분노인지 — 아마 둘 다일 것이다.\n\n카이가 처음으로 미소 짓는다. "고마워. 믿어줘서."\n\n그가 Nexus의 은신처로 안내한다. 낡은 건물이지만 안에는 각성자들이 가득하다. 젊고, 지쳤고, 그리고 눈빛에 열망이 있다.\n\n"여기가 우리야. AURA에 쫓기는 사람들이 모인 곳."`,
      choices: [
        { text: '"함께 싸울게."',              next: 'ch4b_s1', faction: -5  },
        { text: '"강 국장이 문제군요."',       next: 'ch4b_s1', faction: -10 },
        { text: '"Echo는 어디 있어?"',         next: 'ch4b_s1', faction: -5  },
      ],
    },

    /* 4B-2. 강 국장의 실체 */
    {
      id: 'ch4b_s1', type: 'story',
      title: '쿠데타의 설계자',
      text: `카이가 기밀 파일을 꺼낸다.\n\n"**강 국장**. AURA의 총책임자. 그가 지금 뭘 하고 있는지 봐."\n\n파일에는 인체실험 기록이 가득하다. 격리된 각성자에게 능력 강화 약물을 투여해 전투 능력을 극대화하는 실험들.\n\n"강 국장은 초능력자를 무기로 만들어 정치 권력을 잡으려 해. 쿠데타 계획이야."\n\n"지유는 아마 몰라. 그녀는 속고 있어."`,
      choices: [
        { text: '"지유에게 알려야 하지 않을까?"',      next: 'ch4b_combat1', faction: -5, relation: { jiyu: 5, kai: -5 } },
        { text: '"강 국장을 먼저 막는 게 맞아."',      next: 'ch4b_combat1', faction: -10 },
        { text: '"오라클도 그 계획에 연루된 것 같은데."', next: 'ch4b_combat1', faction: -5  },
      ],
    },

    /* 4B-3. 지유와의 전투 */
    {
      id: 'ch4b_combat1', type: 'combat',
      title: '스승이었던 자',
      preText: 'Nexus 은신처 입구. 지유가 당신 앞을 막아서고 있었다.\n\n"가게 할 수 없어요." 그녀의 목소리는 흔들리지 않는다. "당신이 틀렸어요."',
      enemies: ['jiyu_boss'],
      goldReward: 200,
      onWin:  'ch4b_rest1',
      onLose: 'gameover',
    },

    /* 4B-4. 탈출 */
    {
      id: 'ch4b_rest1', type: 'rest',
      title: '탈출',
      text: '지유를 뿌리치고 은신처를 확보했다. 카이가 상처를 치료해준다.\n\n"강 국장의 쿠데타 계획을 막으면 돼. 그러면 AURA의 부패한 구조도 무너질 거야."\n\n그가 잠시 멈춘다. "지유는... 언젠가 이해할 거야."',
      restAmount: { hp: 300, mp: 200 },
      next: 'ch4b_shop1',
    },

    /* 4B-5. 상점 */
    {
      id: 'ch4b_shop1', type: 'shop',
      title: 'Nexus 암시장',
      shopId: 'black_market',
      text: '카이가 Nexus의 무기고를 소개한다. "공식 루트엔 없는 것들이야."',
      next: 'ch5_nexus_s0',
    },
  ],
};
