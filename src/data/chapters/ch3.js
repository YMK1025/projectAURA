/* ─── Chapter 3: 첫 임무 ─── */
export const chapter3 = {
  id: 'ch3',
  title: '첫 임무',
  nodes: [

    /* 3-1. 현장 수색 */
    {
      id: 'ch3_s0', type: 'story',
      image: null,
      title: '사라지는 사람들',
      text: `마지막 실종자의 집을 수색한다. 쓰러진 의자, 엎어진 커피잔. 투쟁의 흔적은 없다. 자발적으로 떠난 것처럼 보인다.\n\n당신의 능력이 반응한다. 이 공간에 무언가가 남아 있다.`,
      choices: [
        { text: '능력을 집중해 잔상을 읽어낸다',  next: 'ch3_combat1', statChanges: { mental: 2, control: 1 }, faction: 0  },
        { text: '지유와 함께 단서를 분석한다',    next: 'ch3_combat1', statChanges: { mental: 3           }, faction: 10 },
        { text: '카이에게 몰래 연락해 정보를 묻는다', next: 'ch3_combat1', statChanges: { mental: 2       }, faction: -15, relation: { kai: 10 } },
      ],
    },

    /* 3-2. 오라클 추종자 전투 */
    {
      id: 'ch3_combat1', type: 'combat',
      image: null,
      title: '창고 앞의 수호자들',
      preText: '한강변 폐창고. 입구를 막은 두 명의 인물이 당신을 막아선다.\n\n그들의 눈빛엔 의지가 없다. 세뇌된 상태다.',
      enemies: ['oracle_follower', 'oracle_follower'],
      goldReward: 100,
      onWin:  'ch3_s1',
      onLose: 'gameover',
    },

    /* 3-3. 오라클 대치 */
    {
      id: 'ch3_s1', type: 'story',
      image: null,
      title: '오라클',
      text: `창고 내부. 로브를 걸친 남자가 서 있다.\n\n**오라클(Oracle)**. 초능력자들을 세뇌하는 정신조작 능력자.\n\n"왔군요." 그의 목소리는 기이하게 울린다. "당신도 갇혀 있는 건 마찬가지예요. AURA라는 새장 안에."\n\n옆에서 카이가 갑자기 나타난다. "그는 적이 아니에요. 이야기를 들어요!"`,
      choices: [
        { text: '지유의 말대로 오라클을 제압한다', next: 'ch3_combat2', statChanges: { power: 2 },  faction: 15,  relation: { jiyu: 10, kai: -10 } },
        { text: '카이를 믿고 오라클의 말을 듣는다', next: 'ch3_event1', statChanges: { mental: 2 }, faction: -20, relation: { kai: 20, jiyu: -5  } },
        { text: '양쪽 다 경계하며 정보를 수집한다', next: 'ch3_event1', statChanges: { mental: 3 }, faction: -5,  relation: { kai: 5             } },
      ],
    },

    /* 3-4a. 오라클과 전투 */
    {
      id: 'ch3_combat2', type: 'combat',
      image: null,
      title: '오라클 제압',
      preText: '"그래서 AURA의 명령을 따르는 거야." 오라클이 실망했다는 듯 고개를 젓는다.',
      enemies: ['oracle_follower', 'rogue_awakened'],
      goldReward: 130,
      onWin:  'ch3_rest1',
      onLose: 'gameover',
    },

    /* 3-4b. 오라클과 대화 (카이 신뢰 경로) */
    {
      id: 'ch3_event1', type: 'event',
      image: null,
      title: '새장 안의 진실',
      text: `오라클이 천천히 말한다.\n\n"AURA의 진짜 목적은 초능력자를 보호하는 게 아니에요. 분류하고, 통제하고 — 위험 등급 이상이 되면 '격리'합니다. 나는 그 격리실에서 탈출했어요."\n\n카이가 고개를 끄덕인다. "그래서 우리가 Nexus를 만든 거야. 우리끼리 지키자고."`,
      choices: [
        { text: '"증거가 있습니까?"',             next: 'ch3_rest1', faction: -10, relation: { kai: 10 }, statChanges: { mental: 3 }, resultText: '오라클이 파일 하나를 건넨다. 처분 가능 등급 목록.' },
        { text: '"지유에게 이 사실을 전하겠습니다."', next: 'ch3_rest1', faction: 10,  relation: { jiyu: 5, kai: -5 }, statChanges: { control: 2 }, resultText: '"그 사람을 믿어요? 선택은 당신 거예요." 카이가 물러섰다.' },
      ],
    },

    /* 3-5. 휴식 */
    {
      id: 'ch3_rest1', type: 'rest',
      image: null,
      title: '귀환 후 정비',
      text: '임무를 마치고 기지로 돌아온다. 지유가 간단한 치료를 해준다.\n\n창밖 도시의 불빛. 누군가의 말이 계속 머릿속을 맴돈다.',
      restAmount: { hp: 200, mp: 150 },
      next: 'ch3_shop1',
    },

    /* 3-6. 암시장 */
    {
      id: 'ch3_shop1', type: 'shop',
      image: null,
      title: '비밀 암시장',
      shopId: 'black_market',
      text: '카이가 귓속말로 위치를 알려준 장소. AURA 공식 루트에는 없는 물건들이 있다.',
      next: 'ch4_s0',
    },
  ],
};
