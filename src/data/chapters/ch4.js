/* ─── Chapter 4: 선택의 기로 ─── */
export const chapter4 = {
  id: 'ch4',
  title: '선택의 기로',
  nodes: [

    /* 4-1. 서버실 침투 */
    {
      id: 'ch4_s0', type: 'story',
      image: null,
      title: 'AURA 기밀 서버',
      text: `지유가 긴박하게 연락을 해온다.\n\n"AURA 본부 지하 서버실에 침투해야 합니다. 누군가 내부 데이터를 외부로 유출하고 있어요."\n\n그런데 목적지에 도착하니 카이가 먼저 와 있다. 노트북에 연결된 케이블, 복사 중인 파일들.\n\n그의 표정은 당신을 보자 굳는다. "...왔군요."`,
      choices: [
        { text: '"뭘 하는 거야, 카이."',              next: 'ch4_s1', faction: 5  },
        { text: '"같이 해. 파일 더 빨리 뽑아낼게."', next: 'ch4_s1', faction: -10, relation: { kai: 10 } },
        { text: '아무 말 없이 상황을 파악한다',        next: 'ch4_s1', faction: 0  },
      ],
    },

    /* 4-2. 지유의 고백 */
    {
      id: 'ch4_s1', type: 'story',
      image: null,
      title: '지유의 진심',
      text: `경보가 울리기 직전, 지유가 서버실로 뛰어 들어온다. 카이를 보는 그녀의 눈빛.\n\n"...이 사람은 제가 압니다."\n\n지유가 조용히 말한다. "카이는 3년 전까지 AURA 요원이었어요. 제가 훈련시켰습니다. 그리고... 제가 격리 명령에 서명했습니다."\n\n카이가 차갑게 웃는다. "그래서 탈출한 거야. 그리고 Nexus를 만들었어. 너희에게 잡힌 사람들을 구하려고."`,
      choices: [
        { text: '"지유, 당신은 뭘 믿습니까"',      next: 'ch4_s2', faction: 0  },
        { text: '"카이, 그 파일에 뭐가 있어"',     next: 'ch4_s2', faction: -5, relation: { kai: 5  } },
        { text: '"둘 다 진실을 말하는 것 같다"',   next: 'ch4_s2', faction: 0  },
      ],
    },

    /* 4-3. 파일 공개 ★ 특별 이벤트 — statChanges 유지 */
    {
      id: 'ch4_s2', type: 'event',
      image: null,
      title: '처분 명령서',
      text: `카이가 파일을 화면에 띄운다.\n\n**처분 가능 등급 목록.** 이름, 능력, 각성 날짜. 그리고 처리 방법란에는 — "영구 격리" 또는 "기억 소거".\n\n당신의 이름도 있다. 처리 방법란은 아직 공란.`,
      choices: [
        { text: '"지유, 이걸 알고 있었습니까"', next: 'ch4_faction', faction: -10, relation: { jiyu: -10 }, statChanges: { mental: 4 }, resultText: '지유가 입을 다문다. 그 침묵이 답이었다.' },
        { text: '"조작된 문서일 수 있어."',      next: 'ch4_faction', faction: 10,  relation: { kai: -5  }, statChanges: { control: 2 }, resultText: '카이가 한숨을 내쉰다. "당신 이름이 거기 있는데도?"' },
        { text: '조용히 파일을 저장한다',         next: 'ch4_faction', faction: 0,                         statChanges: { mental: 3 }, resultText: '어느 쪽도 100% 믿을 수 없다. 직접 확인해야 한다.' },
      ],
    },

    /* 4-4. 진영 선택 */
    {
      id: 'ch4_faction', type: 'story',
      image: null,
      title: '갈림길',
      text: `경보가 전 층으로 퍼진다. AURA 기동대가 15분 내로 도착할 것이다.\n\n지유가 당신에게 손을 내민다. "저와 함께라면 이 모든 걸 내부에서 바꿀 수 있어요."\n\n카이가 반대편에서 말한다. "우리와 합류해. 바깥에서 무너뜨리는 게 더 빨라."\n\n선택할 시간이 없다.`,
      choices: [
        { text: '지유의 손을 잡는다 — AURA에 남는다', next: 'ch4_aura_fight',  faction: 30,  relation: { jiyu: 20, kai: -30 } },
        { text: '카이를 따라간다 — Nexus에 합류한다', next: 'ch4_nexus_fight', faction: -30, relation: { kai: 30, jiyu: -20 } },
      ],
    },

    /* 4-5a. AURA 선택 → 카이 전투 */
    {
      id: 'ch4_aura_fight', type: 'combat',
      image: null,
      title: '동료였던 자',
      preText: '카이의 눈빛이 차가워진다.\n\n"...그래. 선택했군." 그의 손에서 전기가 튀는다. "막을 수밖에 없어."',
      enemies: ['kai_boss'],
      goldReward: 200,
      onWin:  'ch4_rest_aura',
      onLose: 'gameover',
    },

    /* 4-5b. Nexus 선택 → 지유 전투 */
    {
      id: 'ch4_nexus_fight', type: 'combat',
      image: null,
      title: '스승이었던 자',
      preText: '지유가 당신 앞을 막아선다.\n\n"가게 할 수 없어요." 그녀의 목소리는 흔들리지 않는다. "당신이 틀렸어요."',
      enemies: ['jiyu_boss'],
      goldReward: 200,
      onWin:  'ch4_rest_nexus',
      onLose: 'gameover',
    },

    /* 4-6a. AURA 경로 휴식 */
    {
      id: 'ch4_rest_aura', type: 'rest',
      image: null,
      title: '결의',
      text: '카이를 제압했다. 지유가 상처를 치료해준다.\n\n"잘 선택했어요. 우리가 안에서 바꿀 수 있어요." 그녀의 눈엔 믿음이 있다.\n\n하지만 카이의 마지막 말이 머릿속에 남는다. "언젠가 후회하게 될 거야."',
      restAmount: { hp: 300, mp: 200 },
      next: 'ch4_shop_aura',
    },

    /* 4-6b. Nexus 경로 휴식 */
    {
      id: 'ch4_rest_nexus', type: 'rest',
      image: null,
      title: '탈출',
      text: '지유를 뿌리치고 서버실을 빠져나왔다. 카이가 상처를 치료해준다.\n\n"고마워. 믿어줘서." 그가 처음으로 미소 짓는다.\n\n하지만 지유의 눈빛이 뇌리에 박힌다. 실망인지, 분노인지 — 아마 둘 다일 것이다.',
      restAmount: { hp: 300, mp: 200 },
      next: 'ch4_shop_nexus',
    },

    /* 4-7a/b. 상점 */
    {
      id: 'ch4_shop_aura', type: 'shop',
      image: null,
      title: 'AURA 고급 보급소',
      shopId: 'aura_supply',
      text: '지유가 고급 장비 접근 권한을 열어준다. "최종 작전을 위해 준비하세요."',
      next: 'ch5_aura_s0',
    },
    {
      id: 'ch4_shop_nexus', type: 'shop',
      image: null,
      title: 'Nexus 암시장',
      shopId: 'black_market',
      text: '카이가 Nexus의 무기고를 소개한다. "공식 루트엔 없는 것들이야."',
      next: 'ch5_nexus_s0',
    },
  ],
};
