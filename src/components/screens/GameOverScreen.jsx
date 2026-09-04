import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore.js';

export default function GameOverScreen() {
  const { resetGame, currentNodeId } = useGameStore();

  useEffect(() => {
    try { localStorage.removeItem('aura_run'); } catch {}
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', gap: 20,
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: 48, color: '#ef5350', margin: 0, fontWeight: 900,
          textShadow: '0 0 30px #ef5350', letterSpacing: 4,
          animation: 'shake 0.4s',
        }}>
          GAME OVER
        </h1>
        <p style={{ color: '#888', marginTop: 10, fontSize: 13 }}>
          당신의 각성은 여기서 끝났다.
        </p>
      </div>

      <div style={{
        background: '#1a0a0a', border: '1px solid #7f1d1d',
        borderRadius: 10, padding: '16px 24px', maxWidth: 380, width: '100%',
        textAlign: 'center', color: '#aaa', fontSize: 13, lineHeight: 1.7,
      }}>
        쓰러졌지만, 이야기는 끝나지 않았다.<br/>
        더 강해져서 돌아오라.
      </div>

      <button
        onClick={resetGame}
        style={{
          background: 'linear-gradient(135deg, #7f1d1d, #ef5350)',
          border: 'none', borderRadius: 8, padding: '12px 40px',
          color: '#fff', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', letterSpacing: 2,
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
