import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore.js';
import { getNode } from '../../data/chapters/index.js';
import { SKILLS, getSkillAtLevel } from '../../data/skills.js';
import { getEffectDesc } from '../../engine/combat.js';
import StatBar from '../ui/StatBar.jsx';

function getSkillDamagePreview(sk, stats) {
  if (sk.type === 'damage') {
    const base = sk.statScale === 'mental'
      ? stats.mental * sk.multiplier
      : stats.power * 2 * sk.multiplier;
    const total = sk.hits && sk.hits > 1 ? base * sk.hits : base;
    const lo = Math.round(total * 0.85);
    const hi = Math.round(total * 1.15);
    return { kind: 'damage', text: `예상 피해 ~${lo}–${hi}` };
  }
  if (sk.type === 'heal') {
    const amt = Math.round((sk.baseHeal ?? 0) + stats.mental * sk.multiplier);
    return { kind: 'heal', text: `회복 ~${amt}` };
  }
  return null;
}

function getSkillEffectHint(sk) {
  const stat = sk.statScale === 'mental' ? '정신' : '파워';
  switch (sk.type) {
    case 'damage': {
      const base = sk.target === 'all_enemies' ? `전체 공격 · ${stat} × ${sk.multiplier}` : `단일 공격 · ${stat} × ${sk.multiplier}`;
      const extras = [];
      if (sk.hits && sk.hits > 1) extras.push(`${sk.hits}연격`);
      if (sk.lifesteal) extras.push(`피해 ${Math.round(sk.lifesteal * 100)}% HP 흡수`);
      if (sk.burnEffect) extras.push(`화상 ${sk.burnEffect.damage}/턴 × ${sk.burnEffect.duration}턴`);
      if (sk.poisonEffect) extras.push(`독 ${sk.poisonEffect.damage}(+${sk.poisonEffect.stackDamage ?? 0})/턴 × ${sk.poisonEffect.duration}턴`);
      if (sk.bleedEffect) extras.push(`출혈 ${sk.bleedEffect.damage}/공격 × ${sk.bleedEffect.duration}턴`);
      return extras.length ? `${base} · ${extras.join(' · ')}` : base;
    }
    case 'heal':
      return `HP 회복 · 기본 ${sk.baseHeal ?? 0} + 정신 × ${sk.multiplier}`;
    case 'buff': {
      const parts = [];
      if (sk.effect?.type === 'defended') parts.push(`피해 ${Math.round((1 - (sk.effect.mult ?? 0.5)) * 100)}% 감소 (${sk.effect.duration}턴)`);
      if (sk.effect?.type === 'dodge_next') parts.push(`다음 공격 확정 회피`);
      if (sk.effect?.type === 'overdrive') parts.push(`공격력 × ${sk.effect.atkMult} (${sk.effect.duration}턴)`);
      if (sk.healAmount) parts.push(`HP +${sk.healAmount} 회복`);
      if (sk.comboEffect) parts.push('반격 강화');
      if (sk.secondEffect?.type === 'exposed') parts.push(`적 피해 +${Math.round(sk.secondEffect.damageUp * 100)}% (${sk.secondEffect.duration}턴)`);
      if (sk.extraTurn) parts.push('추가 행동 획득');
      return parts.join(' · ') || (sk.desc ?? '');
    }
    case 'debuff': {
      if (sk.effect?.type === 'stun') return `행동 불능 (${sk.effect.duration}턴)`;
      if (sk.effect?.type === 'fear') return `공격력 ${Math.round((1 - sk.effect.atkMult) * 100)}% 감소 (${sk.effect.duration}턴)`;
      if (sk.effect?.type === 'exposed') return `받는 피해 +${Math.round(sk.effect.damageUp * 100)}% (${sk.effect.duration}턴)`;
      return sk.desc ?? '';
    }
    case 'special': {
      if (sk.dominateMult !== undefined) {
        const follow = sk.followEffect
          ? sk.followEffect.type === 'stun'
            ? ` + ${sk.followEffect.duration}턴 행동 불능`
            : ` + ${sk.followEffect.duration}턴 공포`
          : '';
        return `적 자해 (ATK × ${sk.dominateMult})${follow}`;
      }
      if (sk.effect?.type === 'extra_turn') return '추가 행동 획득';
      return sk.desc ?? '';
    }
    default:
      return sk.desc ?? '';
  }
}

const TAB = { SKILL: 'skill', ITEM: 'item' };

export default function CombatScreen() {
  const {
    currentNodeId, combat, hp, maxHp, mp, maxMp,
    stats, skills, skillLevels, inventory, equipment,
    doCombatAttack, doCombatSkill, doCombatDefend, doCombatItem,
  } = useGameStore();
  const node = getNode(currentNodeId);
  const [tab, setTab] = useState(TAB.SKILL);
  const [showGuide, setShowGuide] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [combat?.log]);

  if (!node || !combat) return null;

  const aliveEnemies = combat.enemies.filter(e => e.currentHp > 0);
  const isPlayerTurn = combat.phase === 'player';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 전투 제목 */}
      <div style={{
        background: '#1a0a0a', border: '1px solid #7f1d1d',
        borderRadius: 8, padding: '10px 14px',
      }}>
        <div style={{ color: '#ef5350', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
          ⚔️ {node.title}
        </div>
        {node.preText ? (
          <div style={{ color: '#aaa', fontSize: 12, lineHeight: 1.6 }}>{node.preText}</div>
        ) : (
          <div style={{ color: '#888', fontSize: 12 }}>
            {combat.enemies.length}명의 적과 조우
          </div>
        )}
      </div>

      {/* 적 HP */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {combat.enemies.map((e, i) => (
          <div
            key={e.id + i}
            style={{
              background: '#0d0d1a', border: '1px solid #2a2a3e',
              borderRadius: 8, padding: '10px 14px',
              opacity: e.currentHp <= 0 ? 0.35 : 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: e.currentHp <= 0 ? '#555' : '#ddd' }}>
                {e.currentHp <= 0 ? '💀 ' : (e.isBoss || e.isFinalBoss ? '👑 ' : '')}{e.name}
              </span>
              <span style={{ fontSize: 12, color: '#888' }}>{e.currentHp}/{e.maxHp}</span>
            </div>
            <StatBar value={e.currentHp} max={e.maxHp} color="#ef5350" label="" />
            {e.currentHp > 0 && e.staggerMax && (
              <div style={{ marginTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 9, color: '#888' }}>자세</span>
                  <div style={{ flex: 1, height: 4, background: '#1a1a00', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, ((e.staggerCurrent ?? 0) / e.staggerMax) * 100)}%`,
                      height: '100%', background: '#ffd54f', borderRadius: 2,
                      transition: 'width 0.2s',
                    }} />
                  </div>
                </div>
              </div>
            )}
            {e.currentHp > 0 && (e.weakTo || e.resistTo) && (
              <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                {e.weakTo && (
                  <span style={{ fontSize: 11, color: '#fff176', fontWeight: 700 }}>
                    ⚡ 약점: {e.weakTo === 'physical' ? '파워' : e.weakTo === 'psychic' ? '정신' : '자연'}
                  </span>
                )}
                {e.resistTo && (
                  <span style={{ fontSize: 11, color: '#90caf9', fontWeight: 600 }}>
                    🛡 반감: {e.resistTo === 'physical' ? '파워' : e.resistTo === 'psychic' ? '정신' : '자연'}
                  </span>
                )}
              </div>
            )}
            {e.effects?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                {e.effects.map((ef, j) => (
                  <span key={j} style={{
                    background: '#1a1a2e', border: '1px solid #333', borderRadius: 4,
                    padding: '1px 6px', fontSize: 10, color: '#ce93d8',
                  }}>
                    {getEffectDesc(ef)} ({ef.duration}턴)
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 플레이어 상태 */}
      <div style={{
        background: '#0a1228', border: '1px solid #1e3a5f',
        borderRadius: 8, padding: '10px 14px',
      }}>
        <StatBar label="HP" value={hp} max={maxHp} color="#ef5350" />
        <StatBar label="MP" value={mp} max={maxMp} color="#7e57c2" />
        {combat.playerEffects?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {combat.playerEffects.map((ef, i) => (
              <span key={i} style={{
                background: '#1a1a2e', border: '1px solid #333', borderRadius: 4,
                padding: '1px 6px', fontSize: 10, color: '#4fc3f7',
              }}>
                {getEffectDesc(ef)} ({ef.duration}턴)
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 전투 로그 */}
      <div
        ref={logRef}
        style={{
          background: '#070710', border: '1px solid #1a1a3e',
          borderRadius: 8, padding: '10px 12px',
          height: 100, overflowY: 'auto',
          fontSize: 12, color: '#bbb', lineHeight: 1.7,
        }}
      >
        {combat.log.slice(-20).map((line, i) => (
          <div
            key={i}
            dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff">$1</strong>') }}
            style={{ animation: 'fadeIn 0.2s' }}
          />
        ))}
        {combat.log.length === 0 && <span style={{ color: '#444' }}>전투 시작...</span>}
      </div>

      {/* 행동 패널 */}
      {isPlayerTurn && aliveEnemies.length > 0 && (
        <div>
          {/* 탭 */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {[['기본', 'basic'], ['스킬', TAB.SKILL], ['아이템', TAB.ITEM]].map(([label, key]) => (
              <button
                key={key}
                onClick={() => key !== 'basic' && setTab(key)}
                style={{
                  background: tab === key || key === 'basic' ? '#1a1a4a' : '#0d0d2e',
                  border: `1px solid ${tab === key || key === 'basic' ? '#4fc3f7' : '#2a2a4e'}`,
                  borderRadius: 6, padding: '6px 14px', color: '#ddd',
                  fontSize: 12, cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 기본 행동 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button onClick={doCombatAttack} style={btnStyle('#1a0d2e', '#9c27b0')}>
              ⚔️ 공격
            </button>
            <button onClick={doCombatDefend} style={btnStyle('#0a1a2a', '#1565c0')}>
              🛡 방어
            </button>
          </div>

          {/* 스킬 탭 */}
          {tab === TAB.SKILL && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {skills.map(skillId => {
                const baseSk = SKILLS[skillId];
                if (!baseSk) return null;
                const skLv = skillLevels[skillId] ?? 1;
                const sk = getSkillAtLevel(baseSk, skLv);
                const canUse = mp >= sk.mpCost;
                const effectHint = getSkillEffectHint(sk);
                const dmgPreview = getSkillDamagePreview(sk, stats);
                return (
                  <button
                    key={skillId}
                    onClick={() => doCombatSkill(skillId)}
                    disabled={!canUse}
                    style={{
                      ...btnStyle('#0d1a1a', canUse ? '#00bcd4' : '#333'),
                      opacity: canUse ? 1 : 0.5,
                      cursor: canUse ? 'pointer' : 'not-allowed',
                      textAlign: 'left',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>
                        {baseSk.emoji} {baseSk.name}
                      </div>
                      <span style={{
                        background: skLv === 4 ? '#ff6f00' : skLv === 3 ? '#ffd54f' : skLv === 2 ? '#00bcd4' : '#555',
                        color: skLv >= 3 ? '#000' : '#fff',
                        borderRadius: 3, padding: '0 5px',
                        fontSize: 9, fontWeight: 700, marginLeft: 4, flexShrink: 0,
                      }}>{skLv === 4 ? '✦각성' : `Lv.${skLv}`}</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#00bcd4', marginTop: 3, lineHeight: 1.4 }}>{effectHint}</div>
                    {dmgPreview && (
                      <div style={{
                        fontSize: 10, marginTop: 2,
                        color: dmgPreview.kind === 'heal' ? '#ef9a9a' : '#81c784',
                      }}>
                        {dmgPreview.text}
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>MP {sk.mpCost}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 아이템 탭 */}
          {tab === TAB.ITEM && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {inventory.filter(it => it.effect && (it.effect.hp || it.effect.mp || it.effect.cleanse)).length === 0 && (
                <p style={{ color: '#555', fontSize: 12 }}>사용 가능한 소비 아이템 없음</p>
              )}
              {inventory
                .filter(it => it.effect && (it.effect.hp || it.effect.mp || it.effect.cleanse))
                .map(it => (
                  <button
                    key={it.id}
                    onClick={() => doCombatItem(it.id)}
                    style={{ ...btnStyle('#0a1a0a', '#4caf50'), textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 12 }}>{it.name}</span>
                    <span style={{ fontSize: 11, color: '#aaa', marginLeft: 8 }}>×{it.qty}</span>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{it.desc}</div>
                  </button>
                ))}
            </div>
          )}

          {/* 속성 가이드 */}
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => setShowGuide(g => !g)}
              style={{
                background: '#0a0a18', border: '1px solid #2a2a4e',
                borderRadius: 5, padding: '4px 10px',
                color: '#888', fontSize: 10, cursor: 'pointer',
              }}
            >
              {showGuide ? '▲ 속성 가이드 닫기' : '⚡ 속성 가이드'}
            </button>
            {showGuide && (
              <div style={{
                background: '#0a0a18', border: '1px solid #2a2a4e',
                borderRadius: 6, padding: '8px 12px', marginTop: 4,
                fontSize: 10, color: '#aaa', lineHeight: 1.8,
              }}>
                <div><span style={{ color: '#ffd54f' }}>파워계 스킬</span> → 민첩형 적에 약함 / 정신계·자연계에 효과적</div>
                <div><span style={{ color: '#ce93d8' }}>정신계 스킬</span> → 중장갑·신비계 적에 효과적</div>
                <div><span style={{ color: '#81c784' }}>자연계 스킬</span> → 민첩형·물리계 적에 효과적</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 적 턴 표시 */}
      {!isPlayerTurn && combat.phase === 'enemy' && (
        <div style={{
          background: '#1a0a0a', border: '1px solid #7f1d1d', borderRadius: 8,
          padding: '14px', textAlign: 'center', color: '#ef5350', animation: 'pulse 0.8s infinite',
        }}>
          적의 턴...
        </div>
      )}
    </div>
  );
}

function btnStyle(bg, borderColor) {
  return {
    background: bg,
    border: `1px solid ${borderColor}`,
    borderRadius: 6,
    padding: '10px 14px',
    color: '#ddd',
    cursor: 'pointer',
    fontSize: 12,
    flex: 1,
    transition: 'all 0.15s',
  };
}
