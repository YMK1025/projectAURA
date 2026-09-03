/* ─── Chapter 3: 오라클 소탕 ─── */
export const chapter3 = {
  id: 'ch3',
  title: '오라클 소탕',
  nodes: [

    {
      id: 'ch3_s0', type: 'story',
      title: '사라지는 사람들',
      text: `마지막 실종자의 집을 수색한다. 쓰러진 의자, 엎어진 커피잔. 투쟁의 흔적은 없다.\n\n당신의 능력이 반응한다. 이 공간에 무언가가 남아 있다.\n\n지유가 단말기를 확인한다. "오라클의 거점이 한강변 폐창고 근처로 파악됐어요. 가장 강력한 간부 — **가시(Thorn)**가 그곳에 있습니다."`,
      choices: [
        { text: '능력을 집중해 잔상을 읽어낸다',      next: 'ch3_combat1', faction: 0  },
        { text: '지유와 함께 단서를 분석한다',         next: 'ch3_combat1', faction: 10 },
        { text: '카이에게 몰래 연락해 정보를 묻는다',  next: 'ch3_combat1', faction: -15, relation: { kai: 10 } },
      ],
    },

    /* 전투 1: 창고 입구 */
    {
      id: 'ch3_combat1', type: 'combat',
      title: '창고 앞의 수호자들',
      preText: '한강변 폐창고. 입구를 막은 두 명의 인물이 당신을 막아선다.\n\n그들의 눈빛엔 의지가 없다. 세뇌된 상태다.',
      enemies: ['oracle_follower', 'oracle_follower'],
      goldReward: 100,
      onWin:  'ch3_s1',
      onLose: 'gameover',
    },

    {
      id: 'ch3_s1', type: 'story',
      title: '오라클',
      text: `창고 내부. 로브를 걸친 남자가 서 있다.\n\n**오라클(Oracle)**. 초능력자들을 세뇌하는 정신조작 능력자.\n\n"왔군요." 그의 목소리는 기이하게 울린다. "당신도 갇혀 있는 건 마찬가지예요. AURA라는 새장 안에."\n\n옆에서 카이가 갑자기 나타난다. "그는 적이 아니에요. 이야기를 들어요!"`,
      choices: [
        { text: '지유의 말대로 오라클을 제압한다',   next: 'ch3_combat2', faction: 15,  relation: { jiyu: 10, kai: -10 } },
        { text: '카이를 믿고 오라클의 말을 듣는다', next: 'ch3_event1',  faction: -20, relation: { kai: 20, jiyu: -5  } },
        { text: '양쪽 다 경계하며 정보를 수집한다', next: 'ch3_event1',  faction: -5,  relation: { kai: 5             } },
      ],
    },

    /* 전투 2A: 오라클 제압 (AURA 선택 시) */
    {
      id: 'ch3_combat2', type: 'combat',
      title: '오라클 제압',
      preText: '"그래서 AURA의 명령을 따르는 거야." 오라클이 실망했다는 듯 고개를 젓는다.',
      enemies: ['oracle_follower', 'rogue_awakened'],
      goldReward: 130,
      onWin:  'ch3_rest1',
      onLose: 'gameover',
    },

    /* 전투 2B: 대화 후 기습 (대화 선택 시) */
    {
      id: 'ch3_event1', type: 'event',
      title: '새장 안의 진실',
      text: `오라클이 천천히 말한다.\n\n"AURA의 진짜 목적은 초능력자를 보호하는 게 아니에요. 분류하고, 통제하고 — 위험 등급 이상이 되면 '격리'합니다. 나는 그 격리실에서 탈출했어요."\n\n카이가 고개를 끄덕인다. "그래서 우리가 Nexus를 만든 거야. 우리끼리 지키자고."`,
      choices: [
        { text: '"증거가 있습니까?"',                next: 'ch3_combat_event', faction: -10, relation: { kai: 10 }, statChanges: { mental: 3 }, resultText: '오라클이 파일 하나를 건넨다. 그 순간, 밖에서 총성이 들린다.' },
        { text: '"지유에게 이 사실을 전하겠습니다."', next: 'ch3_combat_event', faction: 10,  relation: { jiyu: 5, kai: -5 }, statChanges: { control: 2 }, resultText: '카이가 물러서려는 순간 — 창문이 깨지며 추종자들이 쏟아진다.' },
      ],
    },

    {
      id: 'ch3_combat_event', type: 'combat',
      title: '오라클 추종자 기습',
      preText: '대화 도중 창고 외벽을 뚫고 오라클 추종자들이 쏟아진다.\n\n"가시의 명령이야. 회유는 끝났어." 카이가 전기를 끌어모은다.',
      enemies: ['oracle_follower', 'nexus_agent'],
      goldReward: 120,
      onWin:  'ch3_rest1',
      onLose: 'gameover',
    },

    {
      id: 'ch3_rest1', type: 'rest',
      title: '귀환 후 정비',
      text: '임무를 마치고 기지로 돌아온다. 지유가 간단한 치료를 해준다.\n\n창밖 도시의 불빛. 누군가의 말이 계속 머릿속을 맴돈다.',
      restAmount: { hp: 100, mp: 90 },
      next: 'ch3_random1',
    },

    {
      id: 'ch3_random1', type: 'random_event',
      pool: ['re_aura_insider', 're_unstable_reaction', 're_abandoned_cache', 're_awakening_surge', 're_crossroads_choice'],
      next: 'ch3_shop1',
    },

    {
      id: 'ch3_shop1', type: 'shop',
      title: '비밀 암시장',
      shopId: 'black_market',
      text: '카이가 귓속말로 위치를 알려준 장소. AURA 공식 루트에는 없는 물건들이 있다.',
      next: 'ch3_skill_learn',
    },

    {
      id: 'ch3_skill_learn', type: 'skill_learn',
      title: '각성 심화',
      text: '암시장에서 능력 강화 훈련 데이터를 입수했다. 한계를 넘어서는 새로운 기술이 열린다.',
      skillByLineage: {
        physical: 'body_slam',
        psychic:  'mind_blast',
        nature:   'nature_wrath',
      },
      next: 'ch3_s2',
    },

    {
      id: 'ch3_s2', type: 'story',
      title: '가시를 찾아서',
      text: `입수한 파일을 분석한 결과, 오라클의 실질적 전투 지휘자 **가시(Thorn)**의 거점을 파악했다.\n\n"가시는 공포를 무기로 다루는 정신계 능력자예요." 지유가 설명한다. "그녀의 눈을 보면 공포에 마비된다고 합니다."\n\n카이가 통신으로 끼어든다. "조심해. 가시는 오라클 내에서도 독단적이야. 심지어 오라클 수뇌부도 그녀를 두려워해."`,
      choices: [
        { text: '"정면 돌파합니다."',             next: 'ch3_combat2b', faction: 5  },
        { text: '"전술적으로 접근합시다."',        next: 'ch3_combat2b', faction: 10 },
        { text: '"카이, 당신도 함께 와줄 수 있어?"', next: 'ch3_combat2b', faction: -5, relation: { kai: 10 } },
      ],
    },

    /* 전투 3: 가시 거점 외곽 경비 */
    {
      id: 'ch3_combat2b', type: 'combat',
      title: '거점 외곽 경비',
      preText: '가시의 거점으로 향하는 골목. 순찰 중인 오라클 요원들과 맞닥뜨린다.\n\n지유가 신호를 보낸다. "제압하고 지나가요. 조용히."',
      enemies: ['oracle_follower', 'oracle_agent'],
      goldReward: 130,
      onWin:  'ch3_combat3',
      onLose: 'gameover',
    },

    /* 전투 4: 거점 내부 정예 */
    {
      id: 'ch3_combat3', type: 'combat',
      title: '오라클 거점 침투',
      preText: '오라클 거점 내부. 이들은 세뇌된 것이 아니다. 진심으로 오라클을 믿는 정예 요원들이다.',
      enemies: ['oracle_agent', 'oracle_follower'],
      goldReward: 150,
      onWin:  'ch3_boss_pre',
      onLose: 'gameover',
    },

    {
      id: 'ch3_boss_pre', type: 'story',
      title: '오라클의 가시',
      text: `거점 심부. 장미 향기가 진하게 퍼진다.\n\n연회색 드레스를 입은 여자가 당신을 바라보고 있다. **가시(Thorn)**.\n\n"오라클의 이상을 막으려는 건가." 그녀의 눈이 당신을 꿰뚫는다. "네가 얼마나 버티나 보지."\n\n공포가 물밀 듯 밀려온다. 하지만 당신은 버텨낸다.`,
      choices: [
        { text: '"오라클의 시대는 끝났어."',           next: 'ch3_boss', faction: 5  },
        { text: '"당신도 이 방식이 옳다고 생각해?"',   next: 'ch3_boss', faction: 0  },
        { text: '말없이 전투 자세를 취한다',            next: 'ch3_boss', faction: 5  },
        { text: '몸으로 직접 막아선다 — 공포는 근육으로 뚫는다', next: 'ch3_boss', faction: 5, statChanges: { power: 2 }, requireLineage: 'physical', resultText: '전신에 힘이 솟구친다. 두려움이 연료로 바뀐다.' },
        { text: '정신력으로 꿰뚫어본다 — 공포의 파동을 역이용한다', next: 'ch3_boss', faction: 0, statChanges: { mental: 2 }, requireLineage: 'psychic', resultText: '가시의 공포 파동을 역으로 읽어낸다. 마음이 맑아진다.' },
        { text: '자연의 기운을 이용한다 — 대지의 흐름으로 중화한다', next: 'ch3_boss', faction: 0, statChanges: { control: 2 }, requireLineage: 'nature', resultText: '공간의 에너지가 호흡처럼 흐른다. 가시의 공포가 녹아든다.' },
      ],
    },

    /* 보스 */
    {
      id: 'ch3_boss', type: 'combat',
      title: '오라클 간부 — 가시',
      preText: '"네가 얼마나 버티나 보지." 공포의 장막이 공간을 가득 채운다.',
      enemies: ['oracle_commander'],
      goldReward: 220,
      onWin:  'ch3_rest2',
      onLose: 'gameover',
    },

    {
      id: 'ch3_rest2', type: 'rest',
      title: '폭풍 전야',
      text: '가시를 제압했다. 그러나 그녀의 마지막 말이 머릿속을 맴돈다.\n\n"...이미 늦었어. 오라클 위에 더 큰 것이 있으니까."\n\n지유의 표정이 굳어진다. "더 큰 것... 오라클을 움직이는 배후가 있다는 건가?"\n\n그리고 당신의 단말기로 AURA 본부에서 긴급 소집 명령이 내려온다.',
      restAmount: { hp: 165, mp: 150 },
      next: 'ch4_s0',
    },
  ],
};
