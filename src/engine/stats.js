/* 스탯 계산 헬퍼 */

export const STAT_MAX = 99;
export const HP_MAX   = 999;
export const MP_MAX   = 999;

/** 플레이어 기본 물리 공격력 */
export function calcPlayerAtk(stats, effects = []) {
  let base = stats.power * 2 + randInt(5, 15);
  const overdrive = effects.find(e => e.type === 'overdrive');
  if (overdrive) base *= overdrive.atkMult ?? 1.5;
  return Math.floor(base);
}

/** 적 기본 물리 공격력 (랜덤 포함) */
export function calcEnemyAtk(enemy, effects = []) {
  let base = enemy.atk + randInt(-5, 10);
  const fear = effects.find(e => e.type === 'fear');
  if (fear) base *= fear.atkMult ?? 0.65;
  return Math.max(1, Math.floor(base));
}

/** 방어력 계산 (플레이어: control 기반, 장비 방어 추가) */
export function calcPlayerDef(stats, equipment = {}, effects = []) {
  const base = Math.floor(stats.control / 4);
  const armorDef = equipment.armor?.effect?.defense ?? 0;
  const defended = effects.find(e => e.type === 'defended');
  const mult = defended ? (1 / (defended.mult ?? 0.5)) : 1;
  return Math.floor((base + armorDef) * mult);
}

/** 피해량 계산 */
export function calcDamage(rawAtk, def) {
  return Math.max(1, rawAtk - def);
}

/** 스킬 데미지 계산 */
export function calcSkillDamage(skill, stats, targetEffects = []) {
  const statVal = skill.statScale === 'mental' ? stats.mental : stats.power;
  let dmg = Math.floor(statVal * skill.multiplier + randInt(5, 20));
  const exposed = targetEffects.find(e => e.type === 'exposed');
  if (exposed) dmg = Math.floor(dmg * (1 + exposed.damageUp));
  return dmg;
}

/** HP 회복량 계산 */
export function calcHeal(skill, stats) {
  return Math.floor(skill.baseHeal + stats.mental * skill.multiplier);
}

/** MP 비용 (장비 보정 적용) */
export function calcMpCost(baseCost, equipment = {}) {
  const mult = equipment.accessory?.effect?.mpCostMult ?? 1;
  return Math.max(1, Math.floor(baseCost * mult));
}

/** 회피 판정 (직업 패시브) */
export function rollDodge(job, effects = []) {
  const dodgeNext = effects.find(e => e.type === 'dodge_next');
  if (dodgeNext) return true;
  if (job === 'clairvoyant')   return Math.random() < 0.20;
  if (job === 'beast_shifter') return Math.random() < 0.15;
  return false;
}

/** 상태이상 틱 처리 (턴 종료 시 duration 감소) */
export function tickEffects(effects) {
  return effects
    .map(e => ({ ...e, duration: e.duration - 1 }))
    .filter(e => e.duration > 0);
}

/** 랜덤 정수 (inclusive) */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 스탯을 범위 내로 클램프 */
export function clampStat(v, min = 0, max = STAT_MAX) {
  return Math.max(min, Math.min(max, v));
}
export function clampHp(v) { return Math.max(0, Math.min(HP_MAX, v)); }
export function clampMp(v) { return Math.max(0, Math.min(MP_MAX, v)); }
