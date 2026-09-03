import { useGameStore } from '../../store/useGameStore.js';
import { JOBS } from '../../data/jobs.js';
import { LINEAGES } from '../../data/lineages.js';

const STAT_LABELS = { power: '파워', control: '제어', mental: '정신' };

export default function JobSelectScreen() {
  const { lineage, chooseJob } = useGameStore();
  const lin = LINEAGES[lineage];
  const availableJobs = Object.values(JOBS).filter(job => job.lineage === lineage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '10px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#4dd0e1', marginBottom: 6 }}>개화</div>
        <h2 style={{ color: '#fff', margin: 0, fontSize: 20 }}>⚘ 능력 개화</h2>
        <p style={{ color: '#888', fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
          수련을 통해 당신의 능력이 완전한 형태로 개화합니다. 직업을 선택하세요.
        </p>
        {lin && (
          <div style={{ fontSize: 12, color: lin.color, marginTop: 4 }}>
            {lin.emoji} {lin.name} 계열
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
        {availableJobs.map(job => (
          <button
            key={job.id}
            onClick={() => chooseJob(job.id)}
            style={{
              background: '#0a1228',
              border: `2px solid #1e3a5f`,
              borderRadius: 12,
              padding: '18px 18px',
              cursor: 'pointer',
              textAlign: 'left',
              color: '#fff',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = job.color;
              e.currentTarget.style.background = '#0d1f3c';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1e3a5f';
              e.currentTarget.style.background = '#0a1228';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>{job.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: job.color }}>{job.name}</div>
                <div style={{ fontSize: 11, color: job.color + 'aa', fontStyle: 'italic' }}>"{job.flavor}"</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#aaa', whiteSpace: 'pre-line', lineHeight: 1.6, marginBottom: 10 }}>{job.desc}</div>
            <div style={{
              background: '#060e1f', border: `1px solid #1e3a5f`,
              borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#888',
            }}>
              <div style={{ color: job.color, fontWeight: 600, marginBottom: 4 }}>패시브: {job.passive}</div>
              {job.statBonus && (
                <div style={{ marginTop: 4 }}>
                  보너스 스탯:
                  {Object.entries(job.statBonus).map(([k, v]) => (
                    <span key={k} style={{ color: '#ffd54f', marginLeft: 6 }}>
                      {STAT_LABELS[k] ?? k} +{v}
                    </span>
                  ))}
                  {job.maxHpBonus ? <span style={{ color: '#66bb6a', marginLeft: 6 }}>HP +{job.maxHpBonus}</span> : null}
                </div>
              )}
              <div style={{ marginTop: 4, color: '#4dd0e1' }}>전용 스킬 획득</div>
            </div>
            <div style={{
              marginTop: 10, textAlign: 'center',
              padding: '8px', background: job.color + '22',
              borderRadius: 8, fontSize: 12, fontWeight: 600, color: job.color,
            }}>
              이 직업을 선택한다
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
