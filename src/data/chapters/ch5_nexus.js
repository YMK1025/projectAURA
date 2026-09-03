/* ─── Chapter 5 (Nexus Path): 혁명 ─── */
export const chapter5_nexus = {
  id: 'ch5_nexus',
  title: '혁명 — Nexus의 길',
  nodes: [

    {
      id: 'ch5_nexus_s0', type: 'story',
      title: '강 국장을 향해',
      text: `카이가 홀로그램 지도를 띄운다.\n\n"강 국장. AURA의 실질적 최고 권력자. 격리 명령서에 서명한 사람." 그의 목소리에 오래된 분노가 실린다.\n\n"그가 주관하는 '처분 위원회' 회의가 내일 열려. 참가자 전원이 한 곳에 모이는 유일한 기회야."\n\n"그리고 하나 더 — 오라클이 강 국장의 쿠데타를 지원하고 있다는 정보를 입수했어. 오라클도 막아야 해."`,
      choices: [
        { text: '"작전 계획을 짜자."',            next: 'ch5_nexus_combat0', faction: -5  },
        { text: '"사람을 해치는 건 최소로."',      next: 'ch5_nexus_combat0', faction: -10 },
        { text: '"전부 드러내버리자. 세상에."',    next: 'ch5_nexus_combat0', faction: -5  },
      ],
    },

    /* 전투 1: 외곽 돌파 */
    {
      id: 'ch5_nexus_combat0', type: 'combat',
      title: 'AURA 본부 외곽',
      preText: '을지로 AURA 본부 외곽. 외부 경비를 먼저 제압해야 한다.\n\n카이가 속삭인다. "조용히. 전기는 내가 맡을게."',
      enemies: ['aura_guard', 'aura_guard'],
      goldReward: 150,
      onWin:  'ch5_nexus_combat1',
      onLose: 'gameover',
    },

    /* 전투 2: 본부 내부 */
    {
      id: 'ch5_nexus_combat1', type: 'combat',
      title: 'AURA 본부 침투',
      preText: '본부 내부. 특수 경비 요원들이 겹겹이 방어하고 있다.\n\n"여기선 소리 내지 말고. 능력으로 제압해요." 카이가 이를 간다.',
      enemies: ['aura_guard', 'aura_elite'],
      goldReward: 170,
      onWin:  'ch5_nexus_random1',
      onLose: 'gameover',
    },

    {
      id: 'ch5_nexus_random1', type: 'random_event',
      pool: ['re_overload_push', 're_black_deal', 're_unstable_reaction', 're_awakening_surge', 're_crossroads_choice'],
      next: 'ch5_nexus_event1',
    },

    {
      id: 'ch5_nexus_event1', type: 'event',
      title: '격리실',
      text: `본부 지하. 카이가 말했던 격리실이 눈앞에 있다.\n\n방음 처리된 문들. 작은 창 너머로 눈빛을 잃은 사람들이 보인다.\n\n카이가 문 앞에서 멈춘다. 그는 이 중 한 방에 3년을 있었다.`,
      choices: [
        { text: '격리된 사람들을 지금 해방시킨다', next: 'ch5_nexus_s1', faction: -15, relation: { kai: 15 }, resultText: '경보가 울린다. 하지만 그들의 눈빛이 돌아오는 것을 봤다.' },
        { text: '작전 후 돌아오기로 한다',          next: 'ch5_nexus_s1', faction: -5,  relation: { kai: 5  }, resultText: '"맞아. 지금은 강 국장 먼저야." 카이가 이를 악물었다.' },
      ],
    },

    {
      id: 'ch5_nexus_s1', type: 'story',
      title: '오라클의 협력',
      text: `계단을 오르다 오라클 요원들과 맞닥뜨린다.\n\n"강 국장이 오라클 요원들을 내부에 심어뒀어." 카이가 이미 파악하고 있었다.\n\n"자신의 쿠데타에 오라클의 전투력을 이용하는 거지. 오라클을 여기서 막지 않으면 강 국장에게 완전한 전투력이 넘어가."`,
      choices: [
        { text: '"먼저 오라클부터 처리하자."',    next: 'ch5_nexus_combat1b', faction: -5 },
        { text: '"동시에 처리할 수 있어."',        next: 'ch5_nexus_combat1b', faction: -5 },
        { text: '"카이, 우리 둘이면 충분해."',    next: 'ch5_nexus_combat1b', faction: -5 },
      ],
    },

    /* 전투 3: 오라클 협력자 */
    {
      id: 'ch5_nexus_combat1b', type: 'combat',
      title: '오라클 협력자',
      preText: '엘리베이터홀 외곽. 강 국장에게 배치된 오라클 요원들과 Nexus 배신자들이 길을 막는다.\n\n"쿠데타에 가담한 자들이야." 카이의 눈빛이 차갑다.',
      enemies: ['oracle_agent', 'nexus_elite'],
      goldReward: 200,
      onWin:  'ch5_nexus_combat2',
      onLose: 'gameover',
    },

    /* 전투 4: 기동대장+오라클 */
    {
      id: 'ch5_nexus_combat2', type: 'combat',
      title: 'AURA 기동대장의 방어선',
      preText: '회의실 층으로 올라가는 엘리베이터홀. 완전무장한 기동 대장이 오라클 요원과 함께 길을 막는다.\n\n"거기까지야. 요원이었던 너는 더 잘 알겠지, 카이."',
      enemies: ['aura_captain', 'oracle_agent'],
      goldReward: 260,
      onWin:  'ch5_nexus_rest1',
      onLose: 'gameover',
    },

    {
      id: 'ch5_nexus_rest1', type: 'rest',
      title: '마지막 준비',
      text: '카이가 상처를 치료한다.\n\n"강 국장 경호는 두꺼워. 하지만 오라클과 기동대를 뚫었으니까 — 이제 그 혼자야."\n\n잠시 침묵 후 그가 말한다. "감사해. 진심으로. 같이 끝내자."',
      restAmount: { hp: 260, mp: 225 },
      next: 'ch5_nexus_boss',
    },

    {
      id: 'ch5_nexus_boss', type: 'story',
      title: '강 국장',
      text: `회의실. 강 국장이 혼자 앉아 당신을 기다리고 있다.\n\n"예상했습니다." 노인의 목소리는 흔들리지 않는다.\n\n"초능력자는 통제되어야 합니다. 역사가 증명하죠. 통제받지 않는 힘은 반드시 누군가를 해칩니다."\n\n그가 천천히 일어선다. "나는 틀리지 않았어요. 방법론에서 견해차가 있을 뿐."`,
      choices: [
        { text: '"그 방법론에 사람이 죽었어."',             next: 'ch5_nexus_final', faction: -10 },
        { text: '"당신의 논리라면 나도 처분 대상이다."',   next: 'ch5_nexus_final', faction: -5  },
        { text: '"...이해는 해. 그래도 멈춰야 한다."',     next: 'ch5_nexus_final', faction: -5  },
      ],
    },

    /* 최종 보스 */
    {
      id: 'ch5_nexus_final', type: 'combat',
      title: '강 국장 최종전',
      preText: '"그렇다면 직접 증명해보세요." 강 국장이 리모컨을 누른다. 등 뒤 벽이 열리며 중무장한 경호원이 나온다.',
      enemies: ['director_kang'],
      goldReward: 0,
      onWin:  'ending_nexus',
      onLose: 'gameover',
    },
  ],
};
