import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore.js';

export default function TitleScreen() {
  const [name, setName] = useState('');
  const { setPlayerName } = useGameStore();

  function start() {
    if (!name.trim()) return;
    setPlayerName(name.trim());
    useGameStore.setState({ screen: 'awakening' });
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%', gap: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: 48, fontWeight: 900, letterSpacing: 8,
          color: '#fff', textShadow: '0 0 30px #4fc3f7',
          margin: 0,
        }}>PROJECT AURA</h1>
        <p style={{ color: '#7b8cde', marginTop: 8, letterSpacing: 2, fontSize: 13 }}>
          2035 서울 — 초능력자 관리 프로그램
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && start()}
          placeholder="요원 코드명 입력"
          maxLength={16}
          style={{
            background: 'transparent',
            border: '1px solid #4fc3f7',
            borderRadius: 6,
            padding: '10px 20px',
            color: '#fff',
            fontSize: 16,
            textAlign: 'center',
            outline: 'none',
            width: 220,
          }}
        />
        <button
          onClick={start}
          disabled={!name.trim()}
          style={{
            background: name.trim() ? 'linear-gradient(135deg, #1565c0, #4fc3f7)' : '#1a1a2e',
            border: 'none',
            borderRadius: 6,
            padding: '12px 40px',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            cursor: name.trim() ? 'pointer' : 'default',
            letterSpacing: 2,
            transition: 'all 0.2s',
          }}
        >
          각성 시작
        </button>
      </div>

      <p style={{ color: '#444', fontSize: 11, marginTop: 20 }}>
        텍스트 어드벤처 RPG · 턴제 전투 · 진영 선택
      </p>
    </div>
  );
}
