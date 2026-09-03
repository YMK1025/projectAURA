/* ─── 2차 직업군 정의 ─── */
export const JOBS = {
  /* ── 물리계 ── */
  guardian: {
    id: 'guardian', lineage: 'physical',
    name: '수호자', emoji: '🛡️', color: '#ef5350',
    desc: '강철 수비로 아군을 지키는 전사.\n피해 경감 패시브, 반격 스킬 보유.',
    flavor: '나를 넘어가려면 먼저 쓰러뜨려라',
    jobSkillId: 'iron_wall',
    statBonus: { control: 10 },
    passive: '받는 피해 10% 영구 감소',
  },
  beast_shifter: {
    id: 'beast_shifter', lineage: 'physical',
    name: '야수술사', emoji: '🐺', color: '#ff7043',
    desc: '야수 본능으로 돌진하는 전사.\n회피 시 HP 회복, 흡혈 공격 보유.',
    flavor: '사냥하거나 사냥당하거나',
    jobSkillId: 'feral_rush',
    statBonus: { power: 10 },
    passive: '회피 성공 시 HP +20 회복, 회피율 +15%',
  },

  /* ── 정신계 ── */
  clairvoyant: {
    id: 'clairvoyant', lineage: 'psychic',
    name: '투시자', emoji: '👁️', color: '#ce93d8',
    desc: '운명을 읽어 공격을 완벽히 회피하는 예지자.\n회피율 +20%, 추가 행동 스킬 보유.',
    flavor: '이미 일어난 일을 어떻게 막겠느냐',
    jobSkillId: 'fate_distort',
    statBonus: { mental: 8 },
    passive: '회피율 +20%',
  },
  dominator: {
    id: 'dominator', lineage: 'psychic',
    name: '지배자', emoji: '🧠', color: '#7c4dff',
    desc: '적의 의지를 완전히 꺾는 정신 지배자.\n상태이상 지속 +1턴, 강력한 지배 스킬.',
    flavor: '저항하는 것은 무의미하다',
    jobSkillId: 'full_domination',
    statBonus: { control: 8 },
    passive: '디버프 지속 시간 +1턴',
  },

  /* ── 자연계 ── */
  pyromancer: {
    id: 'pyromancer', lineage: 'nature',
    name: '화염술사', emoji: '🔥', color: '#ff6f00',
    desc: '업화로 전장을 불태우는 화염 지배자.\n공격 시 화상 부여, 강력한 화염 스킬.',
    flavor: '모든 것은 재로 돌아간다',
    jobSkillId: 'conflagration',
    statBonus: { mental: 8 },
    passive: '일반 공격 시 10% 확률 화상(20dmg/턴×2턴)',
  },
  storm_caller: {
    id: 'storm_caller', lineage: 'nature',
    name: '뇌격사', emoji: '⚡', color: '#4fc3f7',
    desc: '번개로 전장을 제압하는 폭풍의 사도.\n일반 공격력 +15%, 다중타격 스킬 보유.',
    flavor: '폭풍은 선택하지 않는다',
    jobSkillId: 'thunder_storm',
    statBonus: { power: 8 },
    passive: '일반 공격력 +15%',
  },
};

/* 계열별 챕터 획득 스킬 */
export const LINEAGE_CHAPTER_SKILLS = {
  physical: { ch2: 'war_cry',     ch3: 'body_slam'    },
  psychic:  { ch2: 'psychic_scan', ch3: 'mind_blast'   },
  nature:   { ch2: 'stone_wall',   ch3: 'nature_wrath' },
};
