import { useGameStore } from '../../store/useGameStore.js';
import { LINEAGES } from '../../data/lineages.js';
import { JOBS } from '../../data/jobs.js';

export default function AwakeningScreen() {
  const { playerName, lineage, chooseLineage, chooseJob } = useGameStore();

  if (!lineage) {
    // Step 1: 계열 선택
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#4fc3f7', marginBottom: 6 }}>STEP 1 / 2</div>
          <h2 style={{ color: '#fff', margin: 0, fontSize: 20 }}>1차 계열 선택</h2>
          <p style={{ color: '#888', fontSize: 12, marginTop: 6 }}>
            {playerName} 요원, 당신의 능력 계열이 깨어납니다.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          {Object.values(LINEAGES).map(lin => (
            <button
              key={lin.id}
              onClick={() => chooseLineage(lin.id)}
              style={{
                background: '#0d0d1a',
                border: `2px solid ${lin.color}44`,
                borderRadius: 12,
                padding: '16px 18px',
                cursor: 'pointer',
                textAlign: 'left',
                color: '#fff',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = lin.color; e.currentTarget.style.background = '#12122a'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = lin.color + '44'; e.currentTarget.style.background = '#0d0d1a'; }}
            >
              <div style={{ fontSize: 36 }}>{lin.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: lin.color }}>{lin.name}</div>
                  <div style={{ fontSize: 11, color: lin.color + 'aa', fontStyle: 'italic' }}>"{lin.flavor}"</div>
                </div>
                <div style={{ fontSize: 12, color: '#aaa', whiteSpace: 'pre-line', lineHeight: 1.6, marginBottom: 8 }}>{lin.desc}</div>
                <div style={{ fontSize: 11, color: '#666', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span>HP {lin.initHp}</span>
                  <span>MP {lin.initMp}</span>
                  <span>파워 {lin.initStats.power}</span>
                  <span>제어 {lin.initStats.control}</span>
                  <span>정신 {lin.initStats.mental}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: 직업 선택
  const lin = LINEAGES[lineage];
  const availableJobs = lin.jobs.map(id => JOBS[id]).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '10px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: lin.color, marginBottom: 6 }}>STEP 2 / 2</div>
        <h2 style={{ color: '#fff', margin: 0, fontSize: 20 }}>2차 직업 선택</h2>
        <p style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
          {lin.emoji} {lin.name} 계열에서 직업을 선택하세요
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
        {availableJobs.map(job => (
          <button
            key={job.id}
            onClick={() => chooseJob(job.id)}
            style={{
              background: '#0d0d1a',
              border: `2px solid ${job.color}44`,
              borderRadius: 12,
              padding: '18px 18px',
              cursor: 'pointer',
              textAlign: 'left',
              color: '#fff',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = job.color; e.currentTarget.style.background = '#12122a'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = job.color + '44'; e.currentTarget.style.background = '#0d0d1a'; }}
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
              background: '#0a0a18', border: `1px solid ${job.color}33`,
              borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#888',
            }}>
              <div style={{ color: job.color, fontWeight: 600, marginBottom: 4 }}>패시브: {job.passive}</div>
              <div>전용 스킬: <span style={{ color: '#ddd' }}>추후 공개</span></div>
              {job.statBonus && (
                <div style={{ marginTop: 4 }}>
                  보너스 스탯:
                  {Object.entries(job.statBonus).map(([k, v]) => (
                    <span key={k} style={{ color: '#ffd54f', marginLeft: 6 }}>
                      {k === 'power' ? '파워' : k === 'control' ? '제어' : '정신'} +{v}
                    </span>
                  ))}
                  {job.maxHpBonus ? <span style={{ color: '#66bb6a', marginLeft: 6 }}>HP +{job.maxHpBonus}</span> : null}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => chooseLineage(null)}
        style={{
          background: 'transparent', border: '1px solid #333',
          borderRadius: 6, padding: '8px 20px',
          color: '#666', fontSize: 12, cursor: 'pointer',
        }}
      >
        ← 계열 다시 선택
      </button>
    </div>
  );
}
