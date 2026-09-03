import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore.js';

export default function RandomEventScreen() {
  const { currentRandomEvent, resolveRandomEvent } = useGameStore();
  const [flash, setFlash] = useState(null);
  const [pendingChoice, setPendingChoice] = useState(null);

  if (!currentRandomEvent) return null;

  function handleChoice(choice) {
    if (choice.resultText) {
      setFlash(choice.resultText);
      setPendingChoice(choice);
    } else {
      resolveRandomEvent(choice);
    }
  }

  function handleContinue() {
    const choice = pendingChoice;
    setFlash(null);
    setPendingChoice(null);
    resolveRandomEvent(choice);
  }

  const ev = currentRandomEvent;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* 헤더 */}
      <div style={{
        background: '#0d0a1a',
        border: '1px solid #6a1b9a',
        borderRadius: 10,
        padding: '14px 18px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 10,
        }}>
          <span style={{ fontSize: 24 }}>{ev.emoji}</span>
          <div>
            <div style={{ fontSize: 10, color: '#ab47bc', letterSpacing: 2, marginBottom: 2 }}>
              RANDOM EVENT
            </div>
            <h2 style={{ color: '#ce93d8', fontSize: 16, margin: 0 }}>
              {ev.title}
            </h2>
          </div>
        </div>
        <p style={{
          color: '#d1c4e9',
          lineHeight: 1.8,
          fontSize: 13,
          margin: 0,
        }}>
          {ev.text}
        </p>
      </div>

      {/* 결과 텍스트 */}
      {flash && (
        <div style={{
          background: '#1a0d2e',
          border: '1px solid #ab47bc',
          borderRadius: 8,
          padding: '12px 16px',
          color: '#ce93d8',
          fontSize: 13,
          lineHeight: 1.7,
        }}>
          <div>{flash}</div>
          <button
            onClick={handleContinue}
            style={{
              marginTop: 12,
              background: '#150a25',
              border: '1px solid #6a1b9a',
              borderRadius: 6,
              padding: '8px 20px',
              color: '#ce93d8',
              cursor: 'pointer',
              fontSize: 13,
              display: 'block',
              marginLeft: 'auto',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1e0d35'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#150a25'; }}
          >
            계속 →
          </button>
        </div>
      )}

      {/* 선택지 */}
      {!flash && ev.choices && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ev.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice)}
              style={{
                background: '#0d0a1a',
                border: '1px solid #4a148c',
                borderRadius: 8,
                padding: '12px 16px',
                color: '#e1d5f5',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 13,
                lineHeight: 1.5,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#170d2e';
                e.currentTarget.style.borderColor = '#ce93d8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#0d0a1a';
                e.currentTarget.style.borderColor = '#4a148c';
              }}
            >
              <span style={{ color: '#ce93d8', marginRight: 8 }}>{i + 1}.</span>
              {choice.text}
              {/* 스탯/골드/HP 예고 뱃지 */}
              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {choice.statChanges && Object.entries(choice.statChanges).map(([k, v]) => (
                  <span key={k} style={{
                    fontSize: 10, padding: '2px 6px',
                    borderRadius: 4,
                    background: v > 0 ? '#1a2e1a' : '#2e1a1a',
                    color: v > 0 ? '#81c784' : '#e57373',
                    border: `1px solid ${v > 0 ? '#2e5a2e' : '#5a2e2e'}`,
                  }}>
                    {k} {v > 0 ? `+${v}` : v}
                  </span>
                ))}
                {choice.goldChange != null && (
                  <span style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 4,
                    background: choice.goldChange >= 0 ? '#2e2a10' : '#2e1a1a',
                    color: choice.goldChange >= 0 ? '#ffd54f' : '#e57373',
                    border: `1px solid ${choice.goldChange >= 0 ? '#5a4e20' : '#5a2e2e'}`,
                  }}>
                    골드 {choice.goldChange >= 0 ? `+${choice.goldChange}` : choice.goldChange}
                  </span>
                )}
                {choice.hpChange != null && (
                  <span style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 4,
                    background: choice.hpChange >= 0 ? '#1a2e1a' : '#2e1a1a',
                    color: choice.hpChange >= 0 ? '#81c784' : '#e57373',
                    border: `1px solid ${choice.hpChange >= 0 ? '#2e5a2e' : '#5a2e2e'}`,
                  }}>
                    HP {choice.hpChange >= 0 ? `+${choice.hpChange}` : choice.hpChange}
                  </span>
                )}
                {choice.mpChange != null && (
                  <span style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 4,
                    background: choice.mpChange >= 0 ? '#1a2030' : '#2e1a1a',
                    color: choice.mpChange >= 0 ? '#64b5f6' : '#e57373',
                    border: `1px solid ${choice.mpChange >= 0 ? '#1a3050' : '#5a2e2e'}`,
                  }}>
                    MP {choice.mpChange >= 0 ? `+${choice.mpChange}` : choice.mpChange}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
