import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore.js';
import { getNode } from '../../data/chapters/index.js';
import ImagePanel from '../ui/ImagePanel.jsx';

function parseMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function EventScreen() {
  const { currentNodeId, makeChoice } = useGameStore();
  const node = getNode(currentNodeId);
  const [flash, setFlash] = useState(null);

  if (!node) return null;

  function handleChoice(choice) {
    if (choice.resultText) {
      setFlash(choice.resultText);
      setTimeout(() => { setFlash(null); makeChoice(choice); }, 1400);
    } else {
      makeChoice(choice);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ImagePanel src={node.image} alt={node.title} />

      <div style={{
        background: '#0a0a1e', border: '1px solid #2a2a5e',
        borderRadius: 8, padding: '14px 18px',
      }}>
        <h2 style={{ color: '#ce93d8', fontSize: 16, margin: '0 0 10px' }}>
          📋 {node.title}
        </h2>
        <div
          style={{ color: '#ddd', lineHeight: 1.8, fontSize: 13 }}
          dangerouslySetInnerHTML={{ __html: parseMd(node.text) }}
        />
      </div>

      {flash && (
        <div style={{
          background: '#1a1a2e', border: '1px solid #ce93d8', borderRadius: 8,
          padding: '10px 14px', color: '#ce93d8', fontSize: 13, animation: 'fadeIn 0.3s',
        }}>
          {flash}
        </div>
      )}

      {!flash && node.choices && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {node.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice)}
              style={{
                background: '#0d0d2e', border: '1px solid #2a2a5e', borderRadius: 8,
                padding: '12px 16px', color: '#ddd', textAlign: 'left',
                cursor: 'pointer', fontSize: 13, lineHeight: 1.4, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#150d2a'; e.currentTarget.style.borderColor = '#ce93d8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0d0d2e'; e.currentTarget.style.borderColor = '#2a2a5e'; }}
            >
              <span style={{ color: '#ce93d8', marginRight: 8 }}>{i + 1}.</span>
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
