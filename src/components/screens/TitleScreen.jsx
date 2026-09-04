import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore.js';
import { DIFFICULTIES } from '../../data/difficulties.js';

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem('aura_progress')) || { unlockedDifficulties: [0], clearedDifficulties: {} };
  } catch { return { unlockedDifficulties: [0], clearedDifficulties: {} }; }
}

function hasSavedRun() {
  return !!localStorage.getItem('aura_run');
}

const ENDING_LABEL = { aura: 'AURA 엔딩', nexus: 'NEXUS 엔딩' };

export default function TitleScreen() {
  const [name, setName] = useState('');
  const [progress, setProgress] = useState(() => getProgress());
  const [savedRun, setSavedRun] = useState(() => hasSavedRun());
  const [selectedDiff, setSelectedDiff] = useState(() => {
    const prog = getProgress();
    const unlocked = prog.unlockedDifficulties;
    return unlocked[unlocked.length - 1] ?? 0;
  });

  const { setPlayerName, setDifficulty, continueRun } = useGameStore();

  useEffect(() => {
    const prog = getProgress();
    setProgress(prog);
    setSavedRun(hasSavedRun());
    const unlocked = prog.unlockedDifficulties;
    setSelectedDiff(unlocked[unlocked.length - 1] ?? 0);
  }, []);

  function start() {
    if (!name.trim()) return;
    setPlayerName(name.trim());
    setDifficulty(selectedDiff);
    useGameStore.setState({ screen: 'awakening' });
  }

  function handleContinue() {
    continueRun();
  }

  const { unlockedDifficulties, clearedDifficulties } = progress;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'flex-start', height: '100%', gap: 20,
      overflowY: 'auto', padding: '32px 16px 24px',
      boxSizing: 'border-box',
    }}>
      {/* 타이틀 */}
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

      {/* 이어하기 */}
      {savedRun && (
        <button
          onClick={handleContinue}
          style={{
            background: 'linear-gradient(135deg, #0d2a3a, #1565c0)',
            border: '2px solid #4fc3f7',
            borderRadius: 8,
            padding: '12px 40px',
            color: '#4fc3f7',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 2,
            width: '100%',
            maxWidth: 360,
          }}
        >
          ▶ 이어하기
        </button>
      )}

      {/* 새 게임 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', width: '100%', maxWidth: 400 }}>
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
            width: '100%',
            boxSizing: 'border-box',
          }}
        />

        {/* 난이도 선택 */}
        <div style={{ width: '100%' }}>
          <p style={{ color: '#7b8cde', fontSize: 12, marginBottom: 8, letterSpacing: 1, textAlign: 'center' }}>
            난이도 선택
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {DIFFICULTIES.map(diff => {
              const isUnlocked = unlockedDifficulties.includes(diff.id);
              const isSelected = selectedDiff === diff.id;
              return (
                <div
                  key={diff.id}
                  onClick={() => isUnlocked && setSelectedDiff(diff.id)}
                  style={{
                    background: isUnlocked
                      ? (isSelected ? '#0d1a2a' : '#0d0d1a')
                      : '#0a0a12',
                    border: `2px solid ${isUnlocked ? (isSelected ? '#4fc3f7' : '#2a2a4e') : '#1a1a2e'}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    cursor: isUnlocked ? 'pointer' : 'default',
                    opacity: isUnlocked ? 1 : 0.5,
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{diff.emoji}</div>
                  <div style={{
                    color: isSelected ? '#4fc3f7' : (isUnlocked ? '#ccc' : '#555'),
                    fontWeight: 700, fontSize: 13,
                  }}>
                    {diff.name}
                  </div>
                  <div style={{ color: '#666', fontSize: 11, marginTop: 2, lineHeight: 1.4 }}>
                    {diff.desc}
                  </div>
                  {!isUnlocked && (
                    <div style={{ color: '#444', fontSize: 10, marginTop: 4 }}>잠금 🔒</div>
                  )}
                  {isUnlocked && clearedDifficulties[diff.id] && (
                    <div style={{ color: '#4fc3f7', fontSize: 10, marginTop: 4 }}>
                      클리어 ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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
            width: '100%',
          }}
        >
          새 게임 시작
        </button>
      </div>

      {/* 클리어 기록 */}
      {Object.keys(clearedDifficulties).length > 0 && (
        <div style={{
          width: '100%', maxWidth: 400,
          background: '#0a0a14', border: '1px solid #1a1a2e',
          borderRadius: 8, padding: '12px 16px',
        }}>
          <p style={{ color: '#555', fontSize: 11, margin: '0 0 8px', letterSpacing: 1 }}>클리어 기록</p>
          {Object.entries(clearedDifficulties).map(([diffId, endingType]) => {
            const diff = DIFFICULTIES[Number(diffId)];
            if (!diff) return null;
            return (
              <div key={diffId} style={{ color: '#7b8cde', fontSize: 12, marginBottom: 4 }}>
                {diff.emoji} {diff.name} — {ENDING_LABEL[endingType] ?? endingType} 클리어 ✓
              </div>
            );
          })}
        </div>
      )}

      <p style={{ color: '#444', fontSize: 11, marginTop: 4 }}>
        텍스트 어드벤처 RPG · 턴제 전투 · 진영 선택
      </p>
    </div>
  );
}
