import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore.js';
import { getNode } from '../../data/chapters/index.js';
import ImagePanel from '../ui/ImagePanel.jsx';

function parseMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function StoryScreen() {
  const { currentNodeId, stats, ability, makeChoice } = useGameStore();
  const node = getNode(currentNodeId);
  const [flash, setFlash] = useState(null);

  if (!node) return null;

  function handleChoice(choice) {
    if (!canPick(choice)) return;
    if (choice.resultText) {
      setFlash(choice.resultText);
      setTimeout(() => { setFlash(null); makeChoice(choice); }, 1200);
    } else {
      makeChoice(choice);
    }
  }

  function canPick(choice) {
    if (choice.abilityReq && choice.abilityReq !== ability) return false;
    if (choice.req) {
      for (const [stat, val] of Object.entries(choice.req)) {
        if ((stats[stat] ?? 0) < val) return false;
      }
    }
    return true;
  }

  const isLocked = (choice) => {
    if (choice.req) {
      for (const [stat, val] of Object.entries(choice.req)) {
        if ((stats[stat] ?? 0) < val) return `${stat} ${val} 필요`;
      }
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ImagePanel src={node.image} alt={node.title} />

      <div>
        <h2 style={{ color: '#4fc3f7', fontSize: 18, margin: '0 0 12px' }}>{node.title}</h2>
        <div
          style={{ color: '#ddd', lineHeight: 1.8, fontSize: 14 }}
          dangerouslySetInnerHTML={{ __html: parseMd(node.text) }}
        />
      </div>

      {flash && (
        <div style={{
          background: '#1a1a2e', border: '1px solid #4fc3f7', borderRadius: 8,
          padding: '10px 14px', color: '#4fc3f7', fontSize: 13, animation: 'fadeIn 0.3s',
        }}>
          {flash}
        </div>
      )}

      {!flash && node.choices && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {node.choices.map((choice, i) => {
            if (choice.abilityReq && choice.abilityReq !== ability) return null;
            const lock = isLocked(choice);
            return (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                disabled={!!lock}
                style={{
                  background: lock ? '#0a0a1a' : '#0d0d2e',
                  border: `1px solid ${lock ? '#333' : '#2a2a5e'}`,
                  borderRadius: 8,
                  padding: '12px 16px',
                  color: lock ? '#555' : '#ddd',
                  textAlign: 'left',
                  cursor: lock ? 'not-allowed' : 'pointer',
                  fontSize: 13,
                  lineHeight: 1.4,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!lock) { e.currentTarget.style.background = '#12124a'; e.currentTarget.style.borderColor = '#4fc3f7'; }}}
                onMouseLeave={e => { e.currentTarget.style.background = lock ? '#0a0a1a' : '#0d0d2e'; e.currentTarget.style.borderColor = lock ? '#333' : '#2a2a5e'; }}
              >
                <span style={{ color: '#4fc3f7', marginRight: 8 }}>{i + 1}.</span>
                {choice.text}
                {lock && <span style={{ display: 'block', fontSize: 11, color: '#555', marginTop: 4 }}>[{lock}]</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
