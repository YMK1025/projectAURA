import { useGameStore } from '../../store/useGameStore.js';
import { SKILLS, getSkillAtLevel } from '../../data/skills.js';

export default function SkillAwakeningScreen() {
  const { skills, skillLevels, chooseAwakening } = useGameStore();

  const options = skills.filter(id => SKILLS[id]?.levels?.[3]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 28, fontWeight: 900, letterSpacing: 6,
          color: '#ffd54f', textShadow: '0 0 20px #ff6f00',
          marginBottom: 8,
        }}>
          ⚡ 스킬 각성
        </div>
        <div style={{ color: '#aaa', fontSize: 13, lineHeight: 1.7 }}>
          극한에 달한 능력이 새로운 경지에 도달했습니다.<br />
          각성할 스킬을 하나 선택하세요. 이 선택은 되돌릴 수 없습니다.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map(skillId => {
          const base = SKILLS[skillId];
          const curLv = skillLevels[skillId] ?? 1;
          const awakening = getSkillAtLevel(base, 4);
          return (
            <div
              key={skillId}
              style={{
                background: '#0d0d1a',
                border: '1px solid #ff6f00',
                borderRadius: 10,
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#ffd54f' }}>
                  {base.emoji} {base.name}
                  <span style={{
                    marginLeft: 8, fontSize: 10, fontWeight: 700,
                    background: '#333', color: '#aaa', borderRadius: 3, padding: '1px 6px',
                  }}>현재 Lv.{curLv}</span>
                  <span style={{ margin: '0 6px', color: '#555' }}>→</span>
                  <span style={{
                    fontSize: 11, fontWeight: 900,
                    background: '#ff6f00', color: '#000', borderRadius: 3, padding: '1px 8px',
                  }}>✦ {awakening.awakeningDesc ?? '각성'}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#ccc', marginBottom: 10, lineHeight: 1.6 }}>
                {awakening.desc}
              </div>
              <button
                onClick={() => chooseAwakening(skillId)}
                style={{
                  background: '#1a0d00',
                  border: '1px solid #ff6f00',
                  borderRadius: 6,
                  padding: '8px 20px',
                  color: '#ffd54f',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.15s',
                }}
              >
                이 스킬을 각성시킨다
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
