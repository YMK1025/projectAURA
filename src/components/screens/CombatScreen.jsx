import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore.js';
import { getNode } from '../../data/chapters/index.js';
import { SKILLS } from '../../data/skills.js';
import { getEffectDesc } from '../../engine/combat.js';
import StatBar from '../ui/StatBar.jsx';

const TAB = { SKILL: 'skill', ITEM: 'item' };

export default function CombatScreen() {
  const {
    currentNodeId, combat, hp, maxHp, mp, maxMp,
    stats, ability, skills, inventory, equipment,
    doCombatAttack, doCombatSkill, doCombatDefend, doCombatItem,
  } = useGameStore();
  const node = getNode(currentNodeId);
  const [tab, setTab] = useState(TAB.SKILL);
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
        {node.preText && (
          <div style={{ color: '#aaa', fontSize: 12, lineHeight: 1.6 }}>{node.preText}</div>
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
                {e.currentHp <= 0 ? '💀 ' : ''}{e.name}
              </span>
              <span style={{ fontSize: 12, color: '#888' }}>{e.currentHp}/{e.maxHp}</span>
            </div>
            <StatBar value={e.currentHp} max={e.maxHp} color="#ef5350" label="" />
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
                const sk = SKILLS[skillId];
                if (!sk) return null;
                const canUse = mp >= sk.mpCost;
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
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{sk.name}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                      MP {sk.mpCost} · {sk.type}
                    </div>
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
