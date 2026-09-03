/* ─── Chapter 4: 선택의 기로 ─── */
export const chapter4 = {
  id: 'ch4',
  title: '선택의 기로',
  nodes: [

    /* 전투 1: 서버실 접근 중 오라클 경비 */
    {
      id: 'ch4_combat0', type: 'combat',
      title: 'AURA 본부 접근',
      preText: '지유의 연락을 받고 AURA 본부 지하 서버실로 향한다.\n\n지하로 내려가는 통로. 오라클 정찰대가 먼저 잠입해 있었다.',
      enemies: ['oracle_follower', 'oracle_follower'],
      goldReward: 120,
      onWin:  'ch4_s0',
      onLose: 'gameover',
    },

    {
      id: 'ch4_s0', type: 'story',
      title: 'AURA 기밀 서버',
      text: `서버실에 도착하니 카이가 먼저 와 있다. 노트북에 연결된 케이블, 복사 중인 파일들.\n\n그의 표정은 당신을 보자 굳는다. "...왔군요."`,
      choices: [
        { text: '"뭘 하는 거야, 카이."',              next: 'ch4_s1', faction: 5  },
        { text: '"같이 해. 파일 더 빨리 뽑아낼게."', next: 'ch4_s1', faction: -10, relation: { kai: 10 } },
        { text: '아무 말 없이 상황을 파악한다',        next: 'ch4_s1', faction: 0  },
      ],
    },

    {
      id: 'ch4_s1', type: 'story',
      title: '지유의 진심',
      text: `경보가 울리기 직전, 지유가 서버실로 뛰어 들어온다. 카이를 보는 그녀의 눈빛.\n\n"...이 사람은 제가 압니다."\n\n지유가 조용히 말한다. "카이는 3년 전까지 AURA 요원이었어요. 제가 훈련시켰습니다. 그리고... 제가 격리 명령에 서명했습니다."\n\n카이가 차갑게 웃는다. "그래서 탈출한 거야. 그리고 Nexus를 만들었어. 너희에게 잡힌 사람들을 구하려고."`,
      choices: [
        { text: '"지유, 당신은 뭘 믿습니까"',      next: 'ch4_combat1', faction: 0  },
        { text: '"카이, 그 파일에 뭐가 있어"',     next: 'ch4_combat1', faction: -5, relation: { kai: 5  } },
        { text: '"둘 다 진실을 말하는 것 같다"',   next: 'ch4_combat1', faction: 0  },
      ],
    },

    /* 전투 2: 경보 후 AURA 경비 */
    {
      id: 'ch4_combat1', type: 'combat',
      title: '경보 발령',
      preText: '지유의 말이 끝나기도 전에 서버실 경보가 울린다.\n\nAURA 경비 요원들이 복도를 채운다. "문을 막아요!" 지유가 소리친다.',
      enemies: ['aura_elite', 'aura_guard'],
      goldReward: 140,
      onWin:  'ch4_s2',
      onLose: 'gameover',
    },

    {
      id: 'ch4_s2', type: 'event',
      title: '처분 명령서',
      text: `경비를 뚫고 카이가 파일을 화면에 띄운다.\n\n**처분 가능 등급 목록.** 이름, 능력, 각성 날짜. 그리고 처리 방법란에는 — "영구 격리" 또는 "기억 소거".\n\n당신의 이름도 있다. 처리 방법란은 아직 공란.`,
      choices: [
        { text: '"지유, 이걸 알고 있었습니까"', next: 'ch4_s3', faction: -10, relation: { jiyu: -10 }, statChanges: { mental: 4 }, resultText: '지유가 입을 다문다. 그 침묵이 답이었다.' },
        { text: '"조작된 문서일 수 있어."',      next: 'ch4_s3', faction: 10,  relation: { kai: -5  }, statChanges: { control: 2 }, resultText: '카이가 한숨을 내쉰다. "당신 이름이 거기 있는데도?"' },
        { text: '조용히 파일을 저장한다',         next: 'ch4_s3', faction: 0,                         statChanges: { mental: 3 }, resultText: '어느 쪽도 100% 믿을 수 없다. 직접 확인해야 한다.' },
      ],
    },

    {
      id: 'ch4_s3', type: 'story',
      title: '오라클의 기습',
      text: `혼란 속, 서버실 벽이 폭발하듯 무너진다.\n\n"오라클이다!" 지유가 권총을 뽑는다.\n\n오라클의 기동 요원들이 쏟아져 들어온다. AURA 내부 데이터를 노리고 있었던 것이다.\n\n잠시지만 — 지유와 카이가 나란히 서 있다. 당신이 먼저 나서야 한다.`,
      choices: [
        { text: '"둘 다 물러나. 내가 막을게."',   next: 'ch4_combat2', faction: 5  },
        { text: '"지유, 카이, 같이 해결하자."',   next: 'ch4_combat2', faction: 0  },
        { text: '"이게 당신들의 진짜 모습이에요."', next: 'ch4_combat2', faction: 0  },
      ],
    },

    /* 전투 3: 오라클 선발대 */
    {
      id: 'ch4_combat2', type: 'combat',
      title: '오라클 기습대',
      preText: '오라클 기동 요원들이 서버실로 쏟아진다.\n\n지유와 카이가 각자 한쪽을 맡는다. 당신은 중앙을 막는다.',
      enemies: ['oracle_agent', 'nexus_agent'],
      goldReward: 160,
      onWin:  'ch4_boss',
      onLose: 'gameover',
    },

    /* 보스 */
    {
      id: 'ch4_boss', type: 'combat',
      title: '기동대장의 제압 명령',
      preText: 'AURA 기동대장이 오라클 요원들을 제압하며 서버실로 진입한다.\n\n"요원 신분으로 반역이라니. 카이, 그리고 — 당신까지. 직접 처리하겠다."',
      enemies: ['aura_captain'],
      goldReward: 200,
      onWin:  'ch4_faction',
      onLose: 'gameover',
    },

    {
      id: 'ch4_faction', type: 'story',
      title: '갈림길',
      text: `기동대장을 제압했다. 서버실에 비상 소개 명령이 내려진다. 15분 안에 빠져나가야 한다.\n\n지유가 당신에게 손을 내민다. "저와 함께라면 이 모든 걸 내부에서 바꿀 수 있어요."\n\n카이가 반대편에서 말한다. "우리와 합류해. 바깥에서 무너뜨리는 게 더 빨라."\n\n선택할 시간이 없다.`,
      choices: [
        { text: '지유의 손을 잡는다 — AURA에 남는다', next: 'ch4a_s0',  faction: 30,  relation: { jiyu: 20, kai: -30 } },
        { text: '카이를 따라간다 — Nexus에 합류한다', next: 'ch4b_s0', faction: -30, relation: { kai: 30, jiyu: -20 } },
      ],
    },
  ],
};
