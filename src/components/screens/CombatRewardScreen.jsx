import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore.js';

const TYPE_EMOJI = {
  hp: '❤️',
  stat: '⬆️',
  charges: '⚡',
  gold: '💰',
};

export default function CombatRewardScreen() {
  const { combatReward, chooseCombatReward } = useGameStore();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!combatReward) return null;

  const { options } = combatReward;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 헤더 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          color: '#ffd54f', fontWeight: 900, fontSize: 20,
          letterSpacing: 2, marginBottom: 4,
        }}>
          ⚔ 전투 승리
        </div>
        <div style={{ color: '#aaa', fontSize: 13 }}>보상을 선택하세요</div>
      </div>

      {/* 보상 카드 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((option, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                background: '#0d0d1a',
                border: `1px solid ${isHovered ? '#ffd54f' : '#2a2a3e'}`,
                borderRadius: 10,
                padding: '16px 18px',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
              onClick={() => chooseCombatReward(option)}
            >
              <div style={{ fontSize: 32, flexShrink: 0 }}>
                {TYPE_EMOJI[option.type] ?? '🎁'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 3 }}>
                  {option.label}
                </div>
                <div style={{ fontSize: 11, color: '#aaa', lineHeight: 1.5 }}>
                  {option.desc}
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); chooseCombatReward(option); }}
                style={{
                  background: isHovered ? '#ffd54f' : '#1a1a3e',
                  border: `1px solid ${isHovered ? '#ffd54f' : '#3a3a6e'}`,
                  borderRadius: 6,
                  padding: '6px 14px',
                  color: isHovered ? '#000' : '#ccc',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
              >
                선택
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
