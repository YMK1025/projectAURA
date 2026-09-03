# PROJECT AURA — Claude 작업 지침

## 협업 규칙
- 응답에 코드 블록 표시 금지
- 작업 흐름: **명령 → 계획 → 작업 → 결과보고**
- 계획은 표/목록으로 변경 범위 명시 후 바로 작업
- 결과보고는 변경 요약 + 빌드/배포 상태만

---

## 기술 스택
- React 18 + Vite 5 + Zustand 5
- 배포: GitHub Pages (git push origin main → 자동)
- 저장소: https://github.com/YMK1025/projectAURA.git

---

## 파일 구조

```
src/
├── App.jsx                     # SCREEN_MAP (screen → Component)
├── store/useGameStore.js       # 전역 상태 + 모든 액션
├── engine/
│   ├── combat.js               # playerAttack/Skill/Defend, enemyTurn
│   └── stats.js                # 스탯 계산, randInt, clampHp/Mp
├── data/
│   ├── lineages.js             # LINEAGES
│   ├── jobs.js                 # JOBS, LINEAGE_CHAPTER_SKILLS
│   ├── skills.js               # SKILLS, getSkillAtLevel(skill, lv)
│   ├── items.js                # ITEMS, SHOP_INVENTORIES
│   ├── enemies.js              # ENEMIES
│   └── chapters/
│       ├── index.js            # NODE_MAP, getNode(id)
│       ├── ch1.js  ch2.js  ch3.js  ch4.js
│       ├── ch4_aura.js  ch4_nexus.js
│       └── ch5_aura.js  ch5_nexus.js
└── components/screens/
    ├── AwakeningScreen.jsx     # 2단계: 계열→직업 선택
    ├── StoryScreen.jsx         # type: story
    ├── EventScreen.jsx         # type: event (resultText 지원)
    ├── CombatScreen.jsx        # type: combat
    ├── SkillLearnScreen.jsx    # type: skill_learn
    ├── ShopScreen.jsx          # type: shop (skill_crystal 사용 UI 포함)
    └── RestScreen.jsx  LevelUpScreen.jsx  EndingScreen.jsx  GameOverScreen.jsx
```

---

## 노드 타입 필수 필드

| type | 필수 필드 |
|---|---|
| story | title, text, choices[] |
| event | title, text, choices[] — resultText 지원 |
| combat | title, preText, enemies[], goldReward, onWin, onLose |
| rest | title, text, restAmount{hp,mp}, next |
| shop | title, text, shopId, next |
| skill_learn | title, text, skillByLineage{physical,psychic,nature}, next |

**choice 객체**: `{ text, next, faction?, relation?:{jiyu,kai}, statChanges?:{power,control,mental}, resultText? }`

---

## 클래스 시스템

| 계열 | 공통스킬 | 직업1 | 직업2 |
|---|---|---|---|
| physical | smash | guardian | beast_shifter |
| psychic | tele_strike | clairvoyant | dominator |
| nature | element_burst | pyromancer | storm_caller |

**챕터 스킬**: ch2 → war_cry/psychic_scan/stone_wall · ch3 → body_slam/mind_blast/nature_wrath

---

## 전투 흐름
```
플레이어 액션 → _afterPlayerAction()
  → phase=win  → _handleCombatWin() → 레벨업 or goToNode(onWin)
  → phase=enemy → doEnemyTurn()
    → hp≤0 or phase=lose → gameover
```
**적 action**: attack | skill(skillDmgMult, hits?, debuff?) | defend | berserk  
**상태효과**: stun | fear(atkMult) | defended(mult) | exposed(damageUp) | dodge_next | overdrive | burn(damage,duration)

---

## 주요 상수
```
EXP_TABLE = [0,100,250,450,700,1050,1500]  // Lv1~6
STAT_MAX=99 · HP_MAX=999 · MP_MAX=999
```
**레벨업 스탯 증가** (계열별):

| 계열 | power | control | mental | maxHp | maxMp |
|---|---|---|---|---|---|
| physical | +5 | +2 | +1 | +28 | +8 |
| psychic | +1 | +2 | +5 | +12 | +22 |
| nature | +2 | +1 | +4 | +18 | +16 |

---

## 챕터 보스 맵

| 챕터 | 일반전투 | 보스 |
|---|---|---|
| Ch1 | 4회 | rogue_elite (나비) |
| Ch2 | 4회 | nexus_operative (야차) |
| Ch3 | 4회 | oracle_commander (가시) |
| Ch4 공통 | 3회 | aura_captain (기동대장) |
| Ch4 AURA | 1회 | kai_boss |
| Ch4 Nexus | 1회 | jiyu_boss |
| Ch5 AURA | 4회 | echo |
| Ch5 Nexus | 4회 | director_kang |

---

## 상점 ID
- `aura_supply`: recovery_s, stabilizer, energy_drink, combat_suit, skill_crystal
- `black_market`: recovery_m, antidote, reinforced_suit, skill_crystal

---

## 게임 데이터 참조
→ 스킬/적/아이템/캐릭터 전체 목록은 **GAMEDATA.md** 참조
