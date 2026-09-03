import { useGameStore } from '../../store/useGameStore.js';
import { LINEAGES } from '../../data/lineages.js';

export default function AwakeningScreen() {
  const { playerName, chooseLineage } = useGameStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '10px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#4fc3f7', marginBottom: 6 }}>각성</div>
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
