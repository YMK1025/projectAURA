# PROJECT AURA — 게임 데이터 백과사전

> 신규 콘텐츠 추가 시 이 파일을 먼저 확인해 중복·밸런스 충돌을 방지한다.
> 코드 변경 시 이 파일도 함께 업데이트한다.

---

## 목차
1. [캐릭터 계열 (Lineage)](#1-캐릭터-계열)
2. [직업 (Job)](#2-직업)
3. [스킬 (Skills)](#3-스킬)
4. [적 (Enemies)](#4-적)
5. [아이템 & 상점](#5-아이템--상점)
6. [주요 인물](#6-주요-인물)
7. [챕터 흐름도](#7-챕터-흐름도)

---

## 1. 캐릭터 계열

| 계열 | 이름 | 초기 HP | 초기 MP | power | control | mental | 특성 |
|---|---|---|---|---|---|---|---|
| physical | 물리계 ⚔️ | 330 | 130 | 18 | 14 | 5 | 힘·체력 중심 |
| psychic | 정신계 🧠 | 220 | 270 | 8 | 18 | 22 | 정신력·MP 중심 |
| nature | 자연계 🌊 | 270 | 220 | 15 | 10 | 18 | 균형형·원소 공격 |

**레벨업 스탯 증가량:**

| 계열 | power | control | mental | maxHp | maxMp |
|---|---|---|---|---|---|
| physical | +5 | +2 | +1 | +28 | +8 |
| psychic | +1 | +2 | +5 | +12 | +22 |
| nature | +2 | +1 | +4 | +18 | +16 |

**공통 스킬:** physical→스매시 / psychic→염동충격 / nature→원소폭발

---

## 2. 직업

### 물리계 직업

| 직업 | 이름 | 전용 스킬 | 스탯 보너스 | HP 보너스 | 패시브 |
|---|---|---|---|---|---|
| guardian | 수호자 🛡️ | iron_wall (철벽) | control +10 | +60 | 받는 피해 10% 영구 감소 |
| beast_shifter | 야수술사 🐺 | feral_rush (맹습) | power +10 | — | 회피 성공 시 HP +20, 회피율 +15% |

### 정신계 직업

| 직업 | 이름 | 전용 스킬 | 스탯 보너스 | 패시브 |
|---|---|---|---|---|
| clairvoyant | 투시자 👁️ | fate_distort (운명 왜곡) | mental +8 | 회피율 +20% |
| dominator | 지배자 🧠 | full_domination (완전 지배) | control +8 | 디버프 지속 시간 +1턴 |

### 자연계 직업

| 직업 | 이름 | 전용 스킬 | 스탯 보너스 | 패시브 |
|---|---|---|---|---|
| pyromancer | 화염술사 🔥 | conflagration (업화) | mental +8 | 일반 공격 10% 확률 화상(20dmg/턴×2턴) |
| storm_caller | 뇌격사 ⚡ | thunder_storm (뇌폭풍) | power +8 | 일반 공격력 +15% |

---

## 3. 스킬

> **획득 경로**: 계열 선택 시 공통스킬+직업스킬 2개, Ch2 skill_learn 1개, Ch3 skill_learn 1개 = 총 4개

### 3-0. 피해량 계산 공식

**스킬 피해** = `floor(statVal × multiplier + randInt(5, 20))`
- statScale=power → statVal = stats.power
- statScale=mental → statVal = stats.mental
- exposed 상태이상 적용 시 → `× (1 + damageUp)`

**일반 공격** = `floor(power × 3 + randInt(10, 25)) − def`
- def = `floor(control / 4) + 장비 방어력`

**완전 지배 자해** = `floor(적.atk × dominateMult)`

**뇌폭풍 히트당 피해** = `floor(statVal × multiplier)` × hits 회 개별 계산 → 합산

---

### 3-1. 물리계 스킬 전체 레벨 비교

#### 스매시 💪 `smash` — 물리계 공통 / 단일 피해 / 스케일: power

| 레벨 | MP | 배율 | 특이사항 |
|---|---|---|---|
| Lv1 | 20 | 1.8× | — |
| Lv2 | 25 | 2.3× | +0.5 배율, MP +5 |
| Lv3 | 30 | 3.0× | +0.7 배율, MP +5 |

> Lv1→3 배율 증가: +1.2× / MP 증가: +10

---

#### 철벽 🛡 `iron_wall` — 수호자 전용 / 버프(자신)

| 레벨 | MP | 방어 효과 | 추가 효과 |
|---|---|---|---|
| Lv1 | 25 | defended 1턴 (피해 50% 감소) | — |
| Lv2 | 30 | defended 2턴 (피해 50% 감소) | — |
| Lv3 | 35 | defended 2턴 (피해 50% 감소) | overdrive: 다음 공격 ×1.5 |

> Lv3의 overdrive는 방어 후 역습 콤보용. 수호자 패시브(피해 -10%)와 중첩 가능.

---

#### 맹습 🐺 `feral_rush` — 야수술사 전용 / 단일 피해+흡혈 / 스케일: power

| 레벨 | MP | 배율 | 흡혈률 | 흡혈량(배율 30 기준) |
|---|---|---|---|---|
| Lv1 | 30 | 1.6× | 30% | ≈14 |
| Lv2 | 35 | 2.0× | 40% | ≈24 |
| Lv3 | 40 | 2.5× | 50% | ≈37 |

> 흡혈 = `floor(피해량 × 흡혈률)`. 야수술사 회피 패시브와 시너지.

---

#### 전투 함성 📢 `war_cry` — Ch2 획득 (물리계) / 디버프 / fear

| 레벨 | MP | fear 지속 | 공격력 감소 |
|---|---|---|---|
| Lv1 | 20 | 2턴 | 30% 감소 (×0.70) |
| Lv2 | 25 | 2턴 | 40% 감소 (×0.60) |
| Lv3 | 30 | 3턴 | 40% 감소 (×0.60) |

> 지배자 직업이라면 +1턴 추가 (Lv1=3턴, Lv3=4턴).

---

#### 바디슬램 💥 `body_slam` — Ch3 획득 (물리계) / 전체 피해 / 스케일: power

| 레벨 | MP | 배율 | 비고 |
|---|---|---|---|
| Lv1 | 35 | 1.4× | 전체 적 동시 타격 |
| Lv2 | 40 | 1.8× | +0.4 배율 |
| Lv3 | 45 | 2.2× | +0.4 배율 |

---

### 3-2. 정신계 스킬 전체 레벨 비교

#### 염동 충격 🌀 `tele_strike` — 정신계 공통 / 단일 피해 / 스케일: mental

| 레벨 | MP | 배율 |
|---|---|---|
| Lv1 | 25 | 1.8× |
| Lv2 | 30 | 2.3× |
| Lv3 | 38 | 3.0× |

> Lv3에서 MP 증가 폭이 큼(+8). 정신계 초기 MP(270) 기준 약 7회 사용 가능.

---

#### 운명 왜곡 ✨ `fate_distort` — 투시자 전용 / 버프(자신)

| 레벨 | MP | 주 효과 | 부가 효과 |
|---|---|---|---|
| Lv1 | 30 | dodge_next (다음 공격 확정 회피) | — |
| Lv2 | 35 | dodge_next | 적에게 exposed 2턴 (피해 +25%) |
| Lv3 | 45 | dodge_next | 추가 행동(extraTurn) 획득 |

> Lv3 extraTurn: 스킬 사용 후 phase가 'enemy'가 아닌 'player'로 유지 → 연속 행동 가능.
> 투시자 패시브(회피율 +20%)와 조합 시 확정 회피 + 확률 회피 중첩.

---

#### 완전 지배 🧠 `full_domination` — 지배자 전용 / 특수 (적 자해)

| 레벨 | MP | 자해 배율 | 추가 효과 |
|---|---|---|---|
| Lv1 | 50 | 적 ATK × 0.8 | — |
| Lv2 | 60 | 적 ATK × 1.0 | stun 1턴 (행동 불능) |
| Lv3 | 70 | 적 ATK × 1.2 | fear 2턴 (공격력 -35%) |

> 자해 피해는 적 DEF를 무시하고 적이 플레이어를 공격할 때 쓰는 ATK 값으로 직접 계산.
> 강력하나 MP 비용이 가장 높은 스킬. 지배자 패시브로 stun/fear 지속 +1턴.

---

#### 정신 분석 🔍 `psychic_scan` — Ch2 획득 (정신계) / 디버프 / exposed

| 레벨 | MP | exposed 지속 | 피해 증폭 |
|---|---|---|---|
| Lv1 | 20 | 2턴 | +25% |
| Lv2 | 25 | 2턴 | +35% |
| Lv3 | 30 | 3턴 | +35% |

> 다음 스킬·공격 모두에 적용. 특히 고배율 스킬 직전 사용 시 극대 시너지.

---

#### 정신 폭발 💫 `mind_blast` — Ch3 획득 (정신계) / 전체 피해 / 스케일: mental

| 레벨 | MP | 배율 |
|---|---|---|
| Lv1 | 40 | 1.4× |
| Lv2 | 45 | 1.8× |
| Lv3 | 55 | 2.3× |

> 정신계는 mental 스탯이 높아(Lv6 기준 mental≈52) 전체기 위력이 체감상 물리계 바디슬램보다 강함.

---

### 3-3. 자연계 스킬 전체 레벨 비교

#### 원소 폭발 🌊 `element_burst` — 자연계 공통 / 단일 피해 / 스케일: mental

| 레벨 | MP | 배율 |
|---|---|---|
| Lv1 | 22 | 1.6× |
| Lv2 | 28 | 2.0× |
| Lv3 | 35 | 2.6× |

> 자연계 mental 스탯(18 시작)과 조합. 화염술사 mental 보너스(+8) 시 더 강함.

---

#### 업화 🔥 `conflagration` — 화염술사 전용 / 단일 피해+화상DoT / 스케일: mental

| 레벨 | MP | 배율 | 화상 dmg/턴 | 화상 지속 | 화상 총 피해 |
|---|---|---|---|---|---|
| Lv1 | 40 | 2.0× | 25 | 2턴 | 50 |
| Lv2 | 50 | 2.5× | 35 | 3턴 | 105 |
| Lv3 | 60 | 3.0× | 50 | 3턴 | 150 |

> 화상은 적 턴 시작 시 처리. 스킬 피해 + 화상 총합이 실질 딜. 화염술사 패시브와 별개로 발동.

---

#### 뇌폭풍 ⚡ `thunder_storm` — 뇌격사 전용 / 전체 히트 피해 / 스케일: power

| 레벨 | MP | 배율(타당) | 히트 | 전체 배율 |
|---|---|---|---|---|
| Lv1 | 40 | 0.8× | 2타 | 1.6× |
| Lv2 | 50 | 0.9× | 3타 | 2.7× |
| Lv3 | 60 | 1.0× | 4타 | 4.0× |

> 전체 대상이므로 적 수 × 타당 피해. 적 2명 기준 Lv3 실질 배율 = 8.0×.
> 단, DEF가 히트당 차감. 고DEF 적에겐 분산 손실 발생.

---

#### 석벽 🪨 `stone_wall` — Ch2 획득 (자연계) / 버프(자신)+회복

| 레벨 | MP | 방어 효과 | 방어 지속 | HP 회복 |
|---|---|---|---|---|
| Lv1 | 25 | 피해 40% 감소 (×0.60) | 1턴 | — |
| Lv2 | 30 | 피해 45% 감소 (×0.55) | 1턴 | +50 |
| Lv3 | 35 | 피해 50% 감소 (×0.50) | 2턴 | +80 |

> 철벽(물리계, 50% 감소)과 달리 Lv1은 40% 감소. Lv3에서 동등 수준 + HP 회복 추가.

---

#### 자연의 분노 🌿 `nature_wrath` — Ch3 획득 (자연계) / 전체 피해+화상 / 스케일: mental

| 레벨 | MP | 배율 | 화상 dmg/턴 | 화상 지속 |
|---|---|---|---|---|
| Lv1 | 45 | 1.2× | 15 | 1턴 |
| Lv2 | 55 | 1.5× | 20 | 2턴 |
| Lv3 | 65 | 1.8× | 30 | 2턴 |

> 전체 피해 + 전체 화상. Lv3 기준 업화보다 배율 낮으나 전체 적 화상 적용이 강점.

---

### 3-4. 스킬 획득 요약표

| | 계열 선택 시 | 직업 선택 시 | Ch2 획득 | Ch3 획득 |
|---|---|---|---|---|
| physical | smash | iron_wall 또는 feral_rush | war_cry | body_slam |
| psychic | tele_strike | fate_distort 또는 full_domination | psychic_scan | mind_blast |
| nature | element_burst | conflagration 또는 thunder_storm | stone_wall | nature_wrath |

---

### 3-5. 스킬 밸런스 분석

**단일 피해 최고 배율 (Lv3 기준)**

| 스킬 | 배율 | 스케일 | 비고 |
|---|---|---|---|
| 스매시 | 3.0× | power | 물리계 공통, MP 30 |
| 염동 충격 | 3.0× | mental | 정신계 공통, MP 38 |
| 업화 | 3.0× | mental | 화상 150 추가 |
| 원소 폭발 | 2.6× | mental | MP 효율 최고 |
| 맹습 | 2.5× | power | 피해 50% 흡혈 |

**전체기 실효 배율 비교 (적 1명 기준, Lv3)**

| 스킬 | 대적 1명 | 대적 2명 | 스케일 |
|---|---|---|---|
| 뇌폭풍 | 4.0× | 8.0× | power |
| 정신 폭발 | 2.3× | 4.6× | mental |
| 바디슬램 | 2.2× | 4.4× | power |
| 자연의 분노 | 1.8×+화상 | 3.6×+화상 | mental |

**MP 효율 (피해/MP, Lv1 기준, power=18 가정)**

| 스킬 | 예상 피해 | MP | 효율 |
|---|---|---|---|
| 원소 폭발 | ≈41 | 22 | 1.86 |
| 스매시 | ≈44 | 20 | 2.20 |
| 전투 함성 | 디버프 | 20 | — |
| 염동 충격 | ≈52 | 25 | 2.08 |

**상태이상 스킬 용도 분류**

| 목적 | 최적 스킬 | 이유 |
|---|---|---|
| 즉시 행동 불능 | 완전 지배 Lv2 | stun 확정 |
| 장기 공격력 억제 | 전투 함성 Lv3 | fear 3턴 |
| 딜 증폭 세팅 | 정신 분석 Lv3 | exposed 3턴 +35% |
| 생존+반격 | 철벽 Lv3 | 방어+overdrive |
| 도주·선빵 | 운명 왜곡 Lv3 | 회피+추가행동 |

---

### 3-6. 신규 스킬 추가 가이드

**skills.js에 추가할 필드 명세:**

```
{
  id: 'skill_id',          // 고유 ID (snake_case)
  name: '스킬명',          // 표시 이름
  emoji: '🔥',            // UI 아이콘
  lineage: 'physical|psychic|nature',
  type: 'damage|buff|debuff|heal|special',
  target: 'enemy|self|all_enemies',
  statScale: 'power|mental',  // damage/heal 타입만 필요
  levels: [
    // Lv1 (인덱스 0)
    {
      mpCost: 30,
      multiplier: 1.8,       // damage/heal 타입
      // 또는 effect: { type, duration, ... }  // buff/debuff 타입
      // 또는 dominateMult: 1.0               // special 타입
      lifesteal: 0.3,        // 선택: 흡혈 비율
      burnEffect: { damage: 25, duration: 2 }, // 선택: 화상
      hits: 2,               // 선택: 다중히트
      healAmount: 50,        // 선택: 버프+회복 동시
      comboEffect: { ... },  // 선택: buff 후 추가 효과
      secondEffect: { ... }, // 선택: 버프+적 디버프 동시
      extraTurn: true,       // 선택: 추가 행동
      followEffect: { ... }, // 선택: special 후 디버프
      desc: '스킬 설명 텍스트.',
    },
    // Lv2 (인덱스 1) — 변경되는 속성만 기재
    { mpCost: 35, multiplier: 2.2, desc: '...' },
    // Lv3 (인덱스 2)
    { mpCost: 40, multiplier: 2.8, desc: '...' },
  ],
}
```

**추가 시 체크리스트:**
- [ ] 같은 계열 기존 스킬과 역할 중복 여부 확인 (위 밸런스 표 참조)
- [ ] Lv1 MP가 계열 초기 MP의 15% 이하인지 확인 (physical 130 → 20 이하 권장)
- [ ] jobs.js의 `jobSkillId` 또는 `LINEAGE_CHAPTER_SKILLS`에 등록
- [ ] GAMEDATA.md 3-1~3-3 섹션 업데이트

---

## 4. 적

### 4-1. 일반 적

| ID | 이름 | HP | ATK | DEF | EXP | Gold | 드롭 | 등장 챕터 |
|---|---|---|---|---|---|---|---|---|
| aura_guard | AURA 경비원 🕴️ | 160 | 28 | 7 | 40 | 50 | recovery_s(30%) | Ch1,Ch4,Ch5-N |
| nexus_agent | Nexus 요원 🥷 | 150 | 35 | 5 | 55 | 65 | stabilizer(25%) | Ch1,Ch3,Ch4,Ch5-A |
| rogue_awakened | 폭주 각성자 ⚡ | 200 | 40 | 4 | 60 | 80 | energy_drink(40%) | Ch1 |
| oracle_follower | 오라클 추종자 👤 | 160 | 32 | 6 | 55 | 65 | antidote(20%) | Ch1,Ch2,Ch3,Ch4,Ch5 |
| oracle_agent | 오라클 전투 요원 🕵️ | 210 | 46 | 10 | 70 | 90 | stabilizer(30%) | Ch3,Ch4,Ch5 |
| nexus_elite | Nexus 정예 요원 🔷 | 230 | 55 | 12 | 75 | 100 | energy_drink(30%) | Ch3,Ch4,Ch5-N |
| aura_elite | AURA 특수 요원 🔶 | 240 | 52 | 15 | 75 | 100 | recovery_s(30%) | Ch2,Ch4,Ch5-N |

**적 행동 패턴 메모:**
- `oracle_follower`: 세뇌 파동(fear 디버프) — 공격력 약하나 디버프 위협
- `nexus_elite`: 연속 타격(2히트) + 돌격(×2.0) — 물리 압박
- `aura_elite`: 제압 타격(stun 디버프) — 행동 불능 위협

---

### 4-2. 챕터 보스

| ID | 이름 | HP | ATK | DEF | EXP | 등장 |
|---|---|---|---|---|---|---|
| rogue_elite | 나비 🦋 | 240 | 48 | 8 | 100 | Ch1 보스 |
| nexus_operative | 야차 🐉 | 340 | 60 | 13 | 150 | Ch2 보스 |
| oracle_commander | 가시 🌹 | 500 | 70 | 16 | 200 | Ch3 보스 |

**보스 특이사항:**
- **나비**: berserk 행동 보유(최고 위협). 폭주 상태의 각성자, 애절한 대사
- **야차**: 2히트 연속공격 + 고배율 돌진. HP는 낮지만 DPS 최고
- **가시**: stun + fear 디버프 조합, 높은 HP — 정신계 오라클 간부

---

### 4-3. 중간 보스 (Ch4)

| ID | 이름 | HP | ATK | DEF | EXP | 등장 |
|---|---|---|---|---|---|---|
| aura_captain | AURA 기동대장 🎖️ | 500 | 58 | 18 | 160 | Ch4 공통 분기점 |
| kai_boss | 카이 ⚡ | 580 | 72 | 16 | 280 | Ch4 AURA 경로 |
| jiyu_boss | 지유 🗡️ | 600 | 72 | 22 | 280 | Ch4 Nexus 경로 |
| nexus_lieutenant | Nexus 부사령관 🔫 | 440 | 65 | 13 | 180 | Ch5 AURA |

**중간 보스 메모:**
- **aura_captain**: stun 디버프, 방어 겸비 — 전형적인 탱형 보스
- **kai_boss**: 전기 폭발(×2.0) + 충전 방전(×2.5) — 고배율 순수 딜러
- **jiyu_boss**: 정밀 타격(×1.9) + 방어 충격(×1.5) + 방어 — 균형형 강적

---

### 4-4. 최종 보스

| ID | 이름 | HP | ATK | DEF | EXP | 등장 |
|---|---|---|---|---|---|---|
| echo | Echo 🌑 | 900 | 90 | 22 | 350 | Ch5 AURA 엔딩 |
| director_kang | 강 국장 👔 | 800 | 78 | 28 | 350 | Ch5 Nexus 엔딩 |

**최종 보스 기술:**
- **Echo**: 공명 파동(×2.2), 집단 세뇌(fear), 공명 폭발(×3.5)
- **강 국장**: 능력 억제 필드(suppressed 디버프), 전술 공격(×2.0), 최후 명령(×3.0)

---

## 5. 아이템 & 상점

### 5-1. 소비 아이템

| ID | 이름 | 가격 | 효과 | 드롭 적 |
|---|---|---|---|---|
| recovery_s | 소형 회복제 🧪 | 80G | HP +200 | aura_guard, rogue_elite |
| recovery_l | 대형 회복제 💉 | 200G | HP +500 | — |
| stabilizer | 정신안정제 💊 | 100G | MP +180 | nexus_agent, oracle_agent |
| energy_drink | 에너지 드링크 ⚡ | 150G | HP+120 / MP+120 | rogue_awakened, nexus_elite |
| antidote | 해독제 🫙 | 120G | 상태이상 전체 해제 | oracle_follower |
| awakening_ampoule | 각성 앰플 ✨ | 350G | power/control/mental 중 선택 +8 (영구) | — |
| skill_crystal | 스킬 결정체 💎 | 300G | 보유 스킬 중 최저 레벨 +1 (최대 Lv3) | — |

### 5-2. 장비 아이템

| ID | 이름 | 슬롯 | 가격 | 효과 | 조건 |
|---|---|---|---|---|---|
| aura_vest | AURA 방탄복 🦺 | armor | 400G | DEF +35 | AURA 진영 |
| nexus_chip | Nexus 개조 칩 💾 | accessory | 450G | 스킬 MP -25% | Nexus 진영 |
| reinforced_suit | 강화 수트 🥷 | armor | 250G | DEF +20 | 무관 |
| focus_band | 집중력 밴드 🎯 | accessory | 280G | maxMp +80 | 무관 |

### 5-3. 상점별 재고

| 상점 ID | 등장 | 판매 목록 |
|---|---|---|
| `aura_supply` | Ch4 AURA 경로 | recovery_s, stabilizer, energy_drink, skill_crystal, aura_vest, reinforced_suit |
| `black_market` | Ch4 Nexus 경로 | recovery_l, stabilizer, awakening_ampoule, antidote, skill_crystal, nexus_chip, focus_band |
| `general` | Ch1, Ch2, Ch3 | recovery_s, recovery_l, stabilizer, energy_drink, antidote, skill_crystal, reinforced_suit |

---

## 6. 주요 인물

### 플레이어 (주인공)
- 각성한 초능력자. 계열·직업은 플레이어 선택
- 처분 가능 등급 목록에 이름이 올라 있음 (Ch4 이벤트)

### 지유 (Ji-Yu)
- **소속**: AURA 선임 요원
- **능력**: 정밀 전투 기술, 격투
- **역할**: Ch1~3 동반자 (AURA 경로), Ch4 Nexus 경로에서 적
- **비하인드**: 카이를 직접 훈련시켰고 격리 명령에도 서명했음. 부패한 구조를 내부에서 바꾸려 함
- **보스 스탯**: HP 600 / ATK 72 / DEF 22

### 카이 (Kai)
- **소속**: Nexus 연락책 (전직 AURA 요원)
- **능력**: 전기 조작
- **역할**: Ch1~3 조력자, Ch4 AURA 경로에서 적
- **비하인드**: 3년간 격리실에 수용. 탈출 후 Nexus 결성. 격리된 각성자들을 구하기 위해 싸움
- **보스 스탯**: HP 580 / ATK 72 / DEF 16

### 나비
- **정체**: 폭주 각성자 (Ch1 보스)
- **배경**: 이성을 잃은 젊은 각성자. "멈추고 싶어. 그런데 멈출 수가 없어."
- **테마**: 초능력 폭주의 비극

### 야차
- **정체**: 오라클 연계 요원 (Ch2 보스)
- **배경**: 오라클의 지시를 받는 강력한 근접 전투 능력자
- **대사**: "더는 못 가게 할 거야. 여기서 끝내지."

### 가시
- **정체**: 오라클 간부 (Ch3 보스)
- **능력**: 정신계 — 공포를 무기로 다루는 능력자
- **배경**: 오라클 조직의 핵심 간부
- **대사**: "오라클의 이상을 막으려는 건가. 네가 얼마나 버티나 보지."

### Echo
- **소속**: Nexus 수장
- **능력**: 강력한 정신조작 — 각성자 세뇌 가능, 공간 영향력
- **이념**: 초능력자의 인류 지배. 오라클과 동맹
- **AURA 경로 최종 보스**: HP 900 / ATK 90
- **대사**: "자유란 강자가 지배하는 것. 인간은 이미 시대에 뒤처졌어."

### 강 국장
- **소속**: AURA 총책임자
- **능력**: 군사·행정 권한, 능력 억제 기술 보유
- **이념**: 초능력자는 통제되어야 함 — 방법론이 부패로 변질
- **배경**: 격리 명령서 서명자. 오라클 지원을 받아 쿠데타 획책. '처분 위원회' 주관
- **Nexus 경로 최종 보스**: HP 800 / ATK 78 / DEF 28
- **대사**: "나는 틀리지 않았어요. 방법론에서 견해차가 있을 뿐."

---

## 7. 챕터 흐름도

### 공통 구간 (Ch1~4)

```
[Ch1] 각성·입문
  - 일반전투 4회: aura_guard, nexus_agent, rogue_awakened×2, oracle_follower×2
  - 보스: 나비 (rogue_elite)
  → Ch2

[Ch2] 기지
  - 일반전투 4회: aura_guard×2, nexus_agent×2, oracle_follower+nexus_agent, oracle_follower×2
  - skill_learn: 계열별 2번째 스킬 획득
  - 보스: 야차 (nexus_operative)
  → Ch3

[Ch3] 대립
  - 일반전투 4회: (분기 무관하게 4회 보장)
  - skill_learn: 계열별 3번째 스킬 획득
  - 보스: 가시 (oracle_commander)
  → Ch4

[Ch4] 선택의 기로
  - 일반전투 3회 (공통): oracle_follower×2, aura_elite+aura_guard, oracle_agent+nexus_agent
  - 보스(공통): aura_captain
  ↓ 진영 선택 분기
  ┌─ AURA 경로 ──────────────────────────────────────────┐
  │  일반전투 1회: nexus_elite+nexus_agent               │
  │  보스: 카이 (kai_boss)                               │
  │  → 상점 (aura_supply) → Ch5 AURA                    │
  └──────────────────────────────────────────────────────┘
  ┌─ Nexus 경로 ─────────────────────────────────────────┐
  │  일반전투 1회: aura_elite+aura_guard                  │
  │  보스: 지유 (jiyu_boss)                              │
  │  → 상점 (black_market) → Ch5 Nexus                  │
  └──────────────────────────────────────────────────────┘
```

### AURA 경로 (Ch5)

```
[Ch5 AURA] 정점 — Echo 처단
  목표: Echo + Oracle 연합 분쇄
  - combat0: nexus_agent×2 (인천 외곽)
  - combat1: nexus_agent+oracle_follower (거점 내부)
  - event1: 세뇌된 각성자들 (구출 여부 선택)
  - combat1b: oracle_agent+oracle_follower (지하 진입)
  - combat2: nexus_lieutenant+oracle_agent (Echo 최후 경호)
  - 회복 (hp+400, mp+300)
  - story: Echo 대면
  - 최종전: echo (HP 900)
  → ending_aura
```

### Nexus 경로 (Ch5)

```
[Ch5 Nexus] 혁명 — 강 국장 저지
  목표: 강 국장 쿠데타 + Oracle 지원 차단
  - combat0: aura_guard×2 (AURA 본부 외곽)
  - combat1: aura_guard+aura_elite (본부 내부)
  - event1: 격리실 발견 (해방 여부 선택)
  - combat1b: oracle_agent+nexus_elite (오라클 협력자)
  - combat2: aura_captain+oracle_agent (기동대장 방어선)
  - 회복 (hp+400, mp+300)
  - story: 강 국장 대면
  - 최종전: director_kang (HP 800)
  → ending_nexus
```

### 엔딩 조건 요약

| 엔딩 | 조건 | 키 대립 |
|---|---|---|
| ending_aura | Ch4에서 지유의 손을 잡음 → Echo 격파 | Echo+Oracle vs AURA |
| ending_nexus | Ch4에서 카이를 따라감 → 강 국장 격파 | 강국장+Oracle vs Nexus |

---

## 부록: 상태이상 효과 레퍼런스

| 상태이상 | 효과 | 특이사항 |
|---|---|---|
| stun | 1턴 행동 불능 | 적 턴 스킵 |
| fear | 공격력 ×atkMult (0.6~0.7) | duration 턴 지속 |
| defended | 받는 피해 ×mult (0.5~0.6) | duration 턴 지속 |
| exposed | 받는 피해 +damageUp (0.25~0.35) | duration 턴 지속 |
| dodge_next | 다음 공격 확정 회피 | 1회 사용 후 소멸 |
| overdrive | 다음 공격 ×atkMult (1.5) | iron_wall Lv3 콤보 |
| burn | 매 턴 damage 피해 | duration 턴 지속, DoT |
| suppressed | 능력 억제 (강 국장 전용) | 상세 미구현 |
