/* ── 랜덤 이벤트 풀 (15개) ── */

export const RANDOM_EVENTS = {

  /* ───────────────────────────────────────────
     긍정 보상형 (3개)
  ─────────────────────────────────────────── */

  re_abandoned_cache: {
    id: 're_abandoned_cache',
    emoji: '💾',
    title: '버려진 AURA 데이터 캐시',
    text: '지하 환기구 뒤, 녹슨 철판에 가려진 단말기가 빛을 발한다. AURA 요원이 임무 도중 남긴 응급 캐시다. 암호는 이미 만료됐지만 당신의 능력이 접속 경로를 찾아낸다. 파일 속에는 전술 강화 데이터와 잔여 크레딧이 남아 있다.',
    choices: [
      {
        text: '전술 데이터를 분석해 능력 연동을 강화한다',
        resultText: '데이터 패턴이 당신의 신경계와 동조된다. 반응 속도가 올라간 것이 느껴진다.',
        statChanges: { control: 3 },
        goldChange: 30,
      },
      {
        text: '크레딧만 회수하고 데이터는 삭제한다',
        resultText: '군더더기 없이 처리했다. 흔적을 남기지 않는 것도 능력이다.',
        goldChange: 80,
      },
    ],
  },

  re_scavenger_loot: {
    id: 're_scavenger_loot',
    emoji: '🧳',
    title: '스캐빈저의 전리품',
    text: '폐건물 계단참. 총격전이 있었던 흔적 — 탄피, 흘린 피. 그리고 구석에 처박힌 방수 백. 내용물을 확인하니 능력 강화용 보조 약품과 전투 크레딧이 들어 있다. 주인이 다시 돌아올 것 같지는 않다.',
    choices: [
      {
        text: '약품과 장비를 모두 챙긴다',
        resultText: '보조 약품이 체내에 흡수되며 근력이 미세하게 올라간다.',
        statChanges: { power: 2 },
        goldChange: 50,
        hpChange: 30,
      },
      {
        text: '크레딧만 가져간다 — 개인 용품은 손대지 않는다',
        resultText: '원칙을 지킨다는 건 언제나 작은 손해를 감수하는 일이다.',
        goldChange: 90,
      },
    ],
  },

  re_aura_supply_drop: {
    id: 're_aura_supply_drop',
    emoji: '📦',
    title: '오폭된 보급 드론',
    text: '옥상 끝자락에 AURA 마크가 찍힌 화물 드론이 불시착해 있다. GPS 오류로 잘못 배달된 보급품이다. 회수 신호는 아직 발신되지 않았다. 재빠르게 열어보니 회복 약품과 능력 안정제가 들어 있다.',
    choices: [
      {
        text: '약품을 복용해 컨디션을 끌어올린다',
        resultText: '능력 안정제가 정신 집중을 극적으로 선명하게 만든다.',
        statChanges: { mental: 3 },
        hpChange: 50,
        mpChange: 40,
      },
      {
        text: '장비를 팔아 크레딧으로 환전한다',
        resultText: '암시장 브로커가 흔쾌히 받아간다.',
        goldChange: 100,
      },
    ],
  },

  /* ───────────────────────────────────────────
     리스크-보상형 (4개)
  ─────────────────────────────────────────── */

  re_unstable_reaction: {
    id: 're_unstable_reaction',
    emoji: '⚡',
    title: '불안정한 능력 반응',
    text: '버려진 실험실. 깨진 플라스크에서 형광빛 물질이 흘러나온다. 능력 강화 실험의 잔류물로 보인다. 당신의 능력이 그것에 반응하며 증폭 신호를 보낸다. 접촉하면 일시적으로 엄청난 강화를 얻겠지만, 불안정한 에너지가 신체를 태울 수도 있다.',
    choices: [
      {
        text: '위험을 감수하고 에너지와 접촉한다',
        resultText: '폭발적인 에너지가 온몸을 관통한다. 뼛속까지 타는 느낌이지만 — 강해졌다.',
        statChanges: { power: 4, control: 2 },
        hpChange: -30,
      },
      {
        text: '안전하게 잔류물만 채취해 분석한다',
        resultText: '작은 통에 담아 데이터를 기록했다. 느리지만 확실한 방식.',
        statChanges: { mental: 2 },
        goldChange: 30,
      },
    ],
  },

  re_shortcut_tunnel: {
    id: 're_shortcut_tunnel',
    emoji: '🚇',
    title: '지하 지름길',
    text: '지도에 없는 폐쇄된 지하철 터널 입구가 열려 있다. 안쪽은 어둡고 이상한 냄새가 난다. 지름길인 건 분명하지만, 터널 안에서 무언가가 움직이는 소리가 들린다. 이전에 폭주 각성자들이 은신처로 쓴 곳이라는 소문이 있다.',
    choices: [
      {
        text: '터널을 빠르게 돌파한다 — 위험이 있어도',
        resultText: '어둠 속에서 뭔가와 스치듯 교전했다. 상처를 입었지만 시간을 크게 단축했다.',
        hpChange: -40,
        mpChange: 30,
        goldChange: 60,
      },
      {
        text: '돌아서 안전한 경로로 간다',
        resultText: '돌아가는 길에 버려진 크레딧 카드를 발견했다. 소소한 위안.',
        goldChange: 20,
      },
    ],
  },

  re_black_deal: {
    id: 're_black_deal',
    emoji: '🤝',
    title: '골목의 거래',
    text: '후드를 눌러쓴 남자가 골목에서 당신을 불러 세운다. 암시장 브로커다. "능력 강화 약 있어요. 정품은 아닌데 — 효과는 확실해요." 그의 손에는 형광빛 앰플이 들려 있다. 비용은 크레딧이 아니다. 몸이 대가다.',
    choices: [
      {
        text: '약을 투여한다 — 부작용이 있어도',
        resultText: '쓴맛이 목을 타고 내려간다. 능력이 잠깐 폭발적으로 열리지만, 반동이 온다.',
        statChanges: { power: 3, mental: 2 },
        hpChange: -35,
      },
      {
        text: '거절하고 그냥 지나간다',
        resultText: '브로커가 어깨를 으쓱하더니 사라진다. 오늘은 조심하기로 했다.',
      },
    ],
  },

  re_overload_push: {
    id: 're_overload_push',
    emoji: '🔥',
    title: '오버로드 직전',
    text: '능력이 갑자기 폭주하기 시작한다. 주변 물체가 진동하고 공기가 흔들린다. 이 상태를 억제하면 안전하지만, 지금 이 에너지를 완전히 개방하면 능력의 한계를 넘어설 수 있다. 의사들은 권장하지 않는 방법이다.',
    choices: [
      {
        text: '에너지를 개방한다 — 한계 너머로',
        resultText: '뇌가 타는 것 같은 고통. 그리고 그 너머에 — 무언가가 열렸다.',
        statChanges: { power: 2, mental: 3 },
        hpChange: -50,
        mpChange: -30,
      },
      {
        text: '차분히 능력을 제어하며 억제한다',
        resultText: '억제 과정에서 집중력이 정제된다. 통제력이 올라간다.',
        statChanges: { control: 3 },
        mpChange: 20,
      },
    ],
  },

  /* ───────────────────────────────────────────
     순수 내러티브형 (4개)
  ─────────────────────────────────────────── */

  re_lost_citizen: {
    id: 're_lost_citizen',
    emoji: '👤',
    title: '미아가 된 시민',
    text: '전투 구역 한가운데, 노인이 혼자 앉아 있다. 능력자들의 충돌로 길을 잃은 것 같다. 그는 당신이 누구인지 모른다. 그저 지나가는 사람을 바라보며 "집에 가야 하는데" 하고 중얼거린다. 당신은 임무 중이다.',
    choices: [
      {
        text: '노인을 안전한 곳까지 데려다준다',
        resultText: '"감사합니다, 젊은이." 그가 손을 꼭 쥔다. 그 온기가 오래 남는다.',
        setFlag: 'helped_citizen',
      },
      {
        text: '구조 요청 신호를 보내고 자리를 뜬다',
        resultText: '할 수 있는 최선을 했다. 그래도 마음이 무겁다.',
      },
    ],
  },

  re_aura_insider: {
    id: 're_aura_insider',
    emoji: '🕵️',
    title: 'AURA 내부 고발자',
    text: '공중화장실. 거울 앞에서 AURA 요원복을 입은 젊은 여자가 당신을 기다리고 있다. "당신이 맞죠?" 그녀는 긴장한 눈빛으로 USB를 내민다. "AURA 내부 실험 기록이에요. 저는 더 이상 여기 있을 수 없어요. 이걸 세상에 알려줘요."',
    choices: [
      {
        text: 'USB를 받아 보관한다',
        resultText: '그녀는 말없이 사라진다. USB 안에 무엇이 담겼는지는 아직 모른다.',
        setFlag: 'met_aura_insider',
      },
      {
        text: '"AURA가 두렵지 않으냐" — 그녀의 각오를 확인한다',
        resultText: '"두렵죠. 그래서 하는 거예요." 그 말이 오래 맴돈다.',
        setFlag: 'met_aura_insider',
        statChanges: { mental: 1 },
      },
    ],
  },

  re_nexus_contact: {
    id: 're_nexus_contact',
    emoji: '📡',
    title: 'Nexus의 연락',
    text: '버스 정류장. 아무도 없는 벤치에 단말기 하나가 놓여 있다. 화면에 메시지가 떠 있다: "잠깐요. 우리 편이에요. 당신 다음 경로에 함정이 설치돼 있어요. 동쪽 우회로를 쓰세요. — N" 함정인지 진짜인지 알 수 없다.',
    choices: [
      {
        text: '정보를 신뢰하고 우회로를 택한다',
        resultText: '우회로에는 아무것도 없었다. 진심인지 함정인지 — 지금은 알 수 없다.',
        setFlag: 'met_nexus_contact',
        mpChange: 20,
      },
      {
        text: '무시하고 원래 경로로 간다',
        resultText: '아무 일도 일어나지 않았다. 어쩌면 함정이 해제된 것일 수도 있다.',
        goldChange: 10,
      },
    ],
  },

  re_rogue_awakened_plea: {
    id: 're_rogue_awakened_plea',
    emoji: '🌀',
    title: '폭주 직전의 각성자',
    text: '골목 막다른 곳. 스무 살쯤 된 청년이 벽을 붙잡고 떨고 있다. 손끝에서 불꽃이 튀고 눈에는 초점이 없다. 폭주 직전의 각성자다. "멈춰줘... 나 죽을 것 같아." 당신은 그와 눈이 마주친다.',
    choices: [
      {
        text: '능력으로 그의 에너지를 안정시키려 한다',
        resultText: '어렵게 안정시켰다. 청년이 눈물을 흘리며 "고마워요"라고 속삭인다.',
        setFlag: 'helped_rogue_awakened',
        mpChange: -20,
        statChanges: { control: 1 },
      },
      {
        text: '"AURA에 연락하면 도움받을 수 있어" — 전달하고 자리를 뜬다',
        resultText: '그게 좋은 선택인지 모르겠다. 하지만 당신이 할 수 있는 건 여기까지였다.',
      },
    ],
  },

  /* ───────────────────────────────────────────
     스탯 선택형 (4개)
  ─────────────────────────────────────────── */

  re_training_opportunity: {
    id: 're_training_opportunity',
    emoji: '🏋️',
    title: '즉흥 훈련 기회',
    text: '임무와 임무 사이의 짧은 공백. 폐건물 옥상, 당신 혼자다. 도시가 발 아래 펼쳐진다. 몸이 달아올라 있다 — 지금 이 에너지를 어디에 쏟을 것인가. 능력의 세 가지 측면 중 하나를 집중 단련한다.',
    choices: [
      {
        text: '[신체] 극한까지 몸을 밀어붙이며 파워 트레이닝',
        resultText: '근육과 능력이 동시에 성장한다. 주먹이 묵직해졌다.',
        statChanges: { power: 3 },
      },
      {
        text: '[집중] 세밀한 제어 훈련으로 정밀도를 높인다',
        resultText: '미세한 조율 감각이 생겼다. 같은 힘으로 더 정교하게 움직일 수 있다.',
        statChanges: { control: 3 },
      },
      {
        text: '[명상] 마음을 비우고 정신력을 회복한다',
        resultText: '고요함 속에서 능력의 깊이가 넓어졌다. 내면이 선명해진다.',
        statChanges: { mental: 3 },
      },
    ],
  },

  re_awakening_surge: {
    id: 're_awakening_surge',
    emoji: '✨',
    title: '각성 서지',
    text: '갑자기 능력이 이유 없이 강하게 반응한다. 마치 내부에서 무언가가 돌파구를 찾는 것처럼. 이 에너지의 흐름을 어느 방향으로 유도할지는 당신의 선택이다. 기회는 지금 이 순간뿐이다.',
    choices: [
      {
        text: '에너지를 공격 능력에 집중시킨다',
        resultText: '폭발적인 타격력이 각인됐다. 손끝이 다르게 느껴진다.',
        statChanges: { power: 3 },
        mpChange: -15,
      },
      {
        text: '에너지를 제어 신경망으로 유도한다',
        resultText: '능력의 정밀도가 한 단계 올라갔다. 원하는 곳에 정확히 쓸 수 있다.',
        statChanges: { control: 3 },
        mpChange: -15,
      },
      {
        text: '에너지를 정신 회로에 풀어 흡수시킨다',
        resultText: '직관이 날카로워졌다. 상대의 움직임을 한 박자 빠르게 읽을 수 있을 것 같다.',
        statChanges: { mental: 3 },
        mpChange: -15,
      },
    ],
  },

  re_focus_session: {
    id: 're_focus_session',
    emoji: '🧠',
    title: '데이터 터미널 특훈',
    text: '지하 데이터 터미널. 누군가 오래된 능력자 훈련 프로그램을 두고 갔다. 내용은 세 가지 방향 중 하나를 선택해 집중 학습하는 방식이다. 터미널은 30분 뒤면 배터리가 방전된다.',
    choices: [
      {
        text: '[전투 분석] 전투 패턴 데이터를 분석해 공격력을 강화한다',
        resultText: '전투 알고리즘이 몸에 새겨졌다. 공격 타이밍이 더 정확해진다.',
        statChanges: { power: 3 },
      },
      {
        text: '[제어 프로토콜] 능력 제어 훈련 데이터를 반복 습득한다',
        resultText: '불필요한 에너지 낭비가 줄었다. 능력이 훨씬 경제적으로 작동한다.',
        statChanges: { control: 3 },
      },
      {
        text: '[심리 분석] 심리전 및 직관력 향상 데이터를 흡수한다',
        resultText: '상황을 읽는 눈이 달라졌다. 상대의 의도가 더 잘 보인다.',
        statChanges: { mental: 3 },
      },
    ],
  },

  re_crossroads_choice: {
    id: 're_crossroads_choice',
    emoji: '🔱',
    title: '능력자의 갈림길',
    text: '지하 벙커 깊숙이. 오래된 AURA 훈련 시설의 폐허다. 세 개의 방이 있다 — 각각 물리, 정신, 자연 계열의 각성을 유도하는 장치가 여전히 작동 중이다. 당신의 계열과 관계없이, 지금 당신에게 부족한 것을 채울 수 있다.',
    choices: [
      {
        text: '[물리 각성실] 신체 한계를 넘어서는 부스트를 받는다',
        resultText: '근골격계가 강화됐다. 이 감각이 오래 지속될 것 같지는 않지만, 지금은 충분하다.',
        statChanges: { power: 3 },
        hpChange: 20,
      },
      {
        text: '[정신 각성실] 사이킥 회로를 강제로 개방한다',
        resultText: '눈을 감아도 주변이 보이는 것 같다. 감각이 날카롭게 벼려졌다.',
        statChanges: { mental: 3 },
        mpChange: 25,
      },
      {
        text: '[자연 각성실] 에너지 흐름 제어를 최적화한다',
        resultText: '기의 흐름이 안정됐다. 능력을 쓸 때마다 낭비가 줄어드는 것이 느껴진다.',
        statChanges: { control: 3 },
        mpChange: 20,
      },
    ],
  },
};
