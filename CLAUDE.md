# PROJECT AURA — Claude 작업 지침

## 협업 규칙
- 응답에 코드 블록 표시 금지
- 작업 흐름: **명령 → 계획 → 승인 → 작업 → 결과보고**
- 계획 단계에서 표/목록으로 변경 범위 명시 후 승인 대기
- 결과보고는 변경 요약 + 빌드/배포 상태만

---

## 기술 스택
- React 18 + Vite 5 + Zustand 5
- 배포: GitHub Pages (main 브랜치 push → 자동 배포)
- 저장소: https://github.com/YMK1025/projectAURA.git

---

## 파일 구조

```
src/
├── App.jsx                     # SCREEN_MAP 관리 (screen → Component)
├── store/useGameStore.js       # 전역 상태 + 모든 액션
├── engine/
│   ├── combat.js               # 전투 로직 (playerAttack/Skill/Defend, enemyTurn)
│   └── stats.js                # 스탯 계산, randInt, clampHp/Mp
├── data/
│   ├── lineages.js             # LINEAGES: 물리계/정신계/자연계
│   ├── jobs.js                 # JOBS: 6개 직업, LINEAGE_CHAPTER_SKILLS
│   ├── skills.js               # SKILLS + getSkillAtLevel(skill, lv)
│   ├── items.js                # ITEMS + SHOP_INVENTORIES
│   ├── enemies.js              # ENEMIES (일반/보스/최종보스)
│   └── chapters/
│       ├── index.js            # NODE_MAP 빌드, getNode(id)
│       ├── ch1.js              # 챕터1 (→ ch2_s0)
│       ├── ch2.js              # 챕터2 (→ ch3_s0)
│       ├── ch3.js              # 챕터3 (→ ch4_s0)
│       ├── ch4.js              # 챕터4 공통 (→ ch4a_s0 / ch4b_s0)
│       ├── ch4_aura.js         # 챕터4 AURA 분기 (→ ch5_aura_s0)
│       ├── ch4_nexus.js        # 챕터4 Nexus 분기 (→ ch5_nexus_s0)
│       ├── ch5_aura.js         # 챕터5 AURA (→ ending_aura)
│       └── ch5_nexus.js        # 챕터5 Nexus (→ ending_nexus)
└── components/
    ├── ui/
    │   ├── HUD.jsx             # 상단 스탯 표시
    │   └── StatBar.jsx         # HP/MP 바
    └── screens/
        ├── TitleScreen.jsx
        ├── AwakeningScreen.jsx  # 2단계: 계열 선택 → 직업 선택
        ├── StoryScreen.jsx      # type: story
        ├── EventScreen.jsx      # type: event (resultText 지원)
        ├── CombatScreen.jsx     # type: combat
        ├── SkillLearnScreen.jsx # type: skill_learn
        ├── ShopScreen.jsx       # type: shop
        ├── RestScreen.jsx       # type: rest
        ├── LevelUpScreen.jsx
        ├── EndingScreen.jsx
        └── GameOverScreen.jsx
```

---

## 노드 타입 (chapters/*.js)

| type | 필수 필드 | 이동 방식 |
|---|---|---|
| story | title, text, choices[] | makeChoice(choice) |
| event | title, text, choices[] | makeChoice(choice) — resultText 지원 |
| combat | title, preText, enemies[], goldReward, onWin, onLose | 전투 승리 시 goToNode(onWin) |
| rest | title, text, restAmount{hp,mp}, next | doRest() → goToNode(next) |
| shop | title, text, shopId, next | goToNode(next) |
| skill_learn | title, text, skillByLineage{physical,psychic,nature}, next | learnChapterSkill() → goToNode(next) |

### choice 객체
```js
{ text, next, faction, relation:{jiyu,kai}, statChanges:{power,control,mental}, resultText }
```

---

## 클래스 시스템

### 1차 계열 (lineages.js)
| id | 공통스킬 | 직업 |
|---|---|---|
| physical | smash | guardian, beast_shifter |
| psychic | tele_strike | clairvoyant, dominator |
| nature | element_burst | pyromancer, storm_caller |

### 2차 직업 패시브 (combat.js 적용)
- guardian: 받는 피해 10% 감소
- beast_shifter: 회피 성공 시 HP+20, 회피율+15%
- clairvoyant: 회피율+20%
- dominator: 디버프 지속 +1턴
- pyromancer: 일반공격 10% 확률 화상(20dmg×2턴)
- storm_caller: 일반공격력 +15%

### 스킬 레벨
```js
getSkillAtLevel(skill, lv)  // lv: 1~3, levels[] 배열 병합
```
스킬 업그레이드: 상점에서 skill_crystal 구매 → useSkillCrystal()

### 챕터별 스킬 습득
- Ch2 skill_learn: war_cry / psychic_scan / stone_wall
- Ch3 skill_learn: body_slam / mind_blast / nature_wrath

---

## 전투 흐름

```
playerAttack / playerSkill / playerDefend / useItemInCombat
  → _afterPlayerAction()
    → phase === 'win'  → _handleCombatWin() → 레벨업 or goToNode(onWin)
    → phase === 'enemy' → doEnemyTurn()
      → phase === 'lose' / hp≤0 → gameover
```

### 적 action 타입
`attack` | `skill(skillName, skillDmgMult, hits?, debuff?)` | `defend` | `berserk`

### 상태효과
`stun` | `fear(atkMult)` | `defended(mult)` | `exposed(damageUp)` | `dodge_next` | `overdrive(atkMult)` | `burn(damage, duration)`

---

## 챕터 구조 요약

### Ch1 (첫 번째 접촉)
일반 전투 4회: aura_guard / nexus_agent / rogue_awakened×2 / oracle_follower×2  
보스: **rogue_elite** (나비)

### Ch2 (수련)
일반 전투 4회: aura_guard×2 / nexus_agent×2 / oracle_follower+nexus_agent / oracle_follower×2  
skill_learn: ch2_skill_learn  
보스: **nexus_operative** (야차)

### Ch3 (오라클 소탕)
일반 전투 4회: oracle_follower×2 / [분기] / oracle_follower+oracle_agent / oracle_agent+oracle_follower  
skill_learn: ch3_skill_learn  
보스: **oracle_commander** (가시)

### Ch4 공통 (선택의 기로)
일반 전투 3회(공통)+1회(분기) = 4회  
보스: **aura_captain** (기동대장) → 진영 선택  
AURA 분기 보스: **kai_boss** / Nexus 분기 보스: **jiyu_boss**

### Ch5 AURA (정점)
일반 전투 4회: nexus_agent×2 / nexus_agent+oracle_follower / oracle_agent+oracle_follower / nexus_lieutenant+oracle_agent  
최종보스: **echo**

### Ch5 Nexus (혁명)
일반 전투 4회: aura_guard×2 / aura_guard+aura_elite / oracle_agent+nexus_elite / aura_captain+oracle_agent  
최종보스: **director_kang**

---

## 주요 상수

```js
EXP_TABLE = [0, 100, 250, 450, 700, 1050, 1500]  // 레벨 1~6
STAT_MAX = 99 | HP_MAX = 999 | MP_MAX = 999
INITIAL_RELATIONS = { jiyu: 0, kai: 0 }
```

### LEVEL_UP_GAINS (계열별)
| lineage | power | control | mental | maxHp | maxMp |
|---|---|---|---|---|---|
| physical | +5 | +2 | +1 | +28 | +8 |
| psychic | +1 | +2 | +5 | +12 | +22 |
| nature | +2 | +1 | +4 | +18 | +16 |

---

## 상점 목록 (SHOP_INVENTORIES)
- `aura_supply`: recovery_s, stabilizer, energy_drink, combat_suit, skill_crystal
- `black_market`: recovery_m, antidote, reinforced_suit, skill_crystal
- (Ch4 이후 동일 shopId 재사용)

---

## 스토리 핵심

- **AURA**: 정부 산하, 초능력자 보호+억제 양면성. 인체실험, 처분 등급 목록 운영
- **Nexus**: 자유를 위한 저항 조직. 카이(Kai) 연락책, Echo가 수장
- **Oracle**: 공공의 적 범죄집단. 세뇌, 각성자 거래
- **AURA 엔딩**: Echo(지배 야망)와 Oracle 소탕 → 초능력자 공개, 조화 엔딩
- **Nexus 엔딩**: 강 국장(쿠데타) Oracle 소탕 → 세계 평화 엔딩
- **지유(Ji-Yu)**: AURA 선임요원, 카이의 전 훈련관
- **카이(Kai)**: Nexus 연락책, 전기 능력자, 전 AURA 요원
