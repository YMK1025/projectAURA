import { useGameStore } from '../../store/useGameStore.js';

export default function LevelUpScreen() {
  const { level, expGainedLast, levelUpGains, stats, maxHp, maxMp, confirmLevelUp } = useGameStore();

  const gains = levelUpGains ?? { power: 0, control: 0, mental: 0, maxHp: 0, maxMp: 0 };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 20, padding: '10px 0',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#ffd54f', marginBottom: 6 }}>
          LEVEL UP
        </div>
        <h1 style={{
          fontSize: 52, color: '#fff', margin: 0, fontWeight: 900,
          textShadow: '0 0 30px #ffd54f, 0 0 60px #ff9800',
          animation: 'glow 1.5s ease-in-out infinite',
        }}>
          Lv.{level}
        </h1>
      </div>

      <div style={{ fontSize: 13, color: '#aaa' }}>
        경험치 +{expGainedLast} 획득
      </div>

      <div style={{
        background: '#0d0d1a', border: '1px solid #ffd54f44',
        borderRadius: 12, padding: '20px 28px', width: '100%', maxWidth: 400,
      }}>
        <div style={{ fontSize: 13, color: '#ffd54f', fontWeight: 700, marginBottom: 14, textAlign: 'center' }}>
          스탯 증가
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: '파워',   key: 'power',   color: '#ef5350', val: stats.power,   gain: gains.power   },
            { label: '제어',   key: 'control', color: '#4fc3f7', val: stats.control, gain: gains.control },
            { label: '정신력', key: 'mental',  color: '#ce93d8', val: stats.mental,  gain: gains.mental  },
            { label: 'HP 최대', key: 'maxHp',  color: '#66bb6a', val: maxHp,         gain: gains.maxHp   },
            { label: 'MP 최대', key: 'maxMp',  color: '#7e57c2', val: maxMp,         gain: gains.maxMp   },
          ].map(({ label, color, val, gain }) => gain > 0 && (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#aaa', fontSize: 13 }}>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#555', fontSize: 12 }}>{val - gain}</span>
                <span style={{ color: '#555', fontSize: 11 }}>→</span>
                <span style={{ color, fontWeight: 700, fontSize: 15 }}>{val}</span>
                <span style={{
                  background: '#1a2a1a', border: `1px solid ${color}`,
                  borderRadius: 4, padding: '1px 6px',
                  color, fontSize: 11, fontWeight: 700,
                }}>
                  +{gain}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={confirmLevelUp}
        style={{
          background: 'linear-gradient(135deg, #e65100, #ffd54f)',
          border: 'none', borderRadius: 8, padding: '14px 48px',
          color: '#000', fontWeight: 900, fontSize: 16,
          cursor: 'pointer', letterSpacing: 2,
          boxShadow: '0 0 20px #ffd54f88',
        }}
      >
        계속
      </button>
    </div>
  );
}
