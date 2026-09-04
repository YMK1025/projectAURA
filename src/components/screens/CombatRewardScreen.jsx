import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore.js';
import { SKILLS } from '../../data/skills.js';

const GRADE_COLORS = {
  common:    '#666',
  rare:      '#4fc3f7',
  epic:      '#ce93d8',
  legendary: '#ffd54f',
};

const GRADE_LABELS = {
  common:    '일반',
  rare:      '희귀',
  epic:      '영웅',
  legendary: '전설',
};

const TYPE_EMOJI = {
  stat:          '⬆️',
  maxhp:         '❤️',
  charges:       '🔋',
  skill_upgrade: '✨',
  item:          '🎁',
  gold:          '💰',
  skill:         '⚔️',
};

function getOptionLabel(option) {
  if (option.type === 'skill_upgrade' && option.skillId) {
    const sk = SKILLS[option.skillId];
    if (sk) return `${sk.emoji ?? '✨'} ${sk.name} 레벨 업`;
  }
  return option.label;
}

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
          const isHovered   = hoveredIdx === idx;
          const grade       = option.grade ?? 'common';
          const gradeColor  = GRADE_COLORS[grade] ?? '#666';
          const gradeLabel  = GRADE_LABELS[grade] ?? grade;
          const isLegendary = grade === 'legendary';

          const borderColor = isHovered ? '#ffd54f' : gradeColor;
          const boxShadow   = isLegendary
            ? `0 0 12px #ffd54f44${isHovered ? ', 0 0 20px #ffd54f66' : ''}`
            : 'none';

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                background:   '#0d0d1a',
                border:       `1px solid ${borderColor}`,
                borderRadius: 10,
                padding:      '16px 18px',
                cursor:       'pointer',
                transition:   'border-color 0.15s, box-shadow 0.15s',
                display:      'flex',
                alignItems:   'center',
                gap:          14,
                position:     'relative',
                boxShadow,
              }}
              onClick={() => chooseCombatReward(option)}
            >
              {/* 등급 뱃지 */}
              <div style={{
                position:        'absolute',
                top:             8,
                right:           60,
                background:      `${gradeColor}33`,
                border:          `1px solid ${gradeColor}`,
                borderRadius:    4,
                padding:         '1px 7px',
                fontSize:        10,
                fontWeight:      700,
                color:           gradeColor,
                letterSpacing:   0.5,
                pointerEvents:   'none',
              }}>
                {gradeLabel}
              </div>

              {/* 타입 이모지 */}
              <div style={{ fontSize: 32, flexShrink: 0 }}>
                {TYPE_EMOJI[option.type] ?? '🎁'}
              </div>

              {/* 텍스트 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 3 }}>
                  {getOptionLabel(option)}
                </div>
                <div style={{ fontSize: 11, color: '#aaa', lineHeight: 1.5 }}>
                  {option.desc}
                </div>
              </div>

              {/* 선택 버튼 */}
              <button
                onClick={e => { e.stopPropagation(); chooseCombatReward(option); }}
                style={{
                  background:   isHovered ? '#ffd54f' : '#1a1a3e',
                  border:       `1px solid ${isHovered ? '#ffd54f' : '#3a3a6e'}`,
                  borderRadius: 6,
                  padding:      '6px 14px',
                  color:        isHovered ? '#000' : '#ccc',
                  fontSize:     12,
                  fontWeight:   700,
                  cursor:       'pointer',
                  flexShrink:   0,
                  transition:   'all 0.15s',
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
