import { useGameStore } from '../../store/useGameStore.js';
import { getNode } from '../../data/chapters/index.js';
import { SKILLS } from '../../data/skills.js';
import { LINEAGES } from '../../data/lineages.js';

export default function SkillLearnScreen() {
  const { currentNodeId, lineage, learnChapterSkill } = useGameStore();
  const node = getNode(currentNodeId);
  if (!node || !node.skillByLineage) return null;

  const skillId = node.skillByLineage[lineage];
  const skill = skillId ? SKILLS[skillId] : null;
  const lin = LINEAGES[lineage];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '10px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#4fc3f7', marginBottom: 6 }}>NEW SKILL</div>
        <h2 style={{ color: '#fff', margin: 0, fontSize: 20 }}>스킬 습득</h2>
        {node.text && (
          <p style={{ color: '#888', fontSize: 12, marginTop: 8, lineHeight: 1.6 }}>{node.text}</p>
        )}
      </div>

      {skill ? (
        <div style={{
          background: '#0d0d1a',
          border: `2px solid ${lin?.color ?? '#4fc3f7'}`,
          borderRadius: 14,
          padding: '20px 22px',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>{skill.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: lin?.color ?? '#4fc3f7' }}>{skill.name}</div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                {skill.lineage === 'physical' ? '물리계' : skill.lineage === 'psychic' ? '정신계' : '자연계'} 스킬 · Lv.1 습득
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.7, marginBottom: 14 }}>
            {skill.levels[0].desc}
          </div>

          <div style={{
            background: '#07070f', border: `1px solid ${lin?.color ?? '#4fc3f7'}33`,
            borderRadius: 8, padding: '10px 14px',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {[1, 2, 3].map(lv => {
              const lvData = skill.levels[lv - 1];
              return (
                <div key={lv} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: lv === 1 ? 1 : 0.45,
                }}>
                  <span style={{
                    background: lv === 1 ? (lin?.color ?? '#4fc3f7') : '#333',
                    color: lv === 1 ? '#000' : '#555',
                    borderRadius: 4, padding: '1px 6px',
                    fontSize: 10, fontWeight: 700, minWidth: 28, textAlign: 'center',
                  }}>Lv.{lv}</span>
                  <span style={{ fontSize: 11, color: lv === 1 ? '#aaa' : '#444' }}>
                    MP {lvData.mpCost} · {lvData.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ color: '#555', fontSize: 13 }}>이 계열에 해당하는 스킬이 없습니다.</div>
      )}

      <button
        onClick={learnChapterSkill}
        style={{
          background: `linear-gradient(135deg, #0a1a2a, ${lin?.color ?? '#4fc3f7'}66)`,
          border: `2px solid ${lin?.color ?? '#4fc3f7'}`,
          borderRadius: 10, padding: '14px 40px',
          color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
          width: '100%',
        }}
      >
        {skill ? `${skill.name} 습득` : '계속'}
      </button>
    </div>
  );
}
