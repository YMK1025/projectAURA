import { useGameStore } from '../../store/useGameStore.js';
import { getNode } from '../../data/chapters/index.js';
import ImagePanel from '../ui/ImagePanel.jsx';

export default function RestScreen() {
  const { currentNodeId, hp, maxHp, mp, maxMp, doRest } = useGameStore();
  const node = getNode(currentNodeId);
  if (!node) return null;

  const hpGain = Math.min(node.restAmount?.hp ?? 0, maxHp - hp);
  const mpGain = Math.min(node.restAmount?.mp ?? 0, maxMp - mp);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ImagePanel src={node.image} alt={node.title} />

      <div style={{
        background: '#081408', border: '1px solid #1b5e20',
        borderRadius: 8, padding: '14px 18px',
      }}>
        <h2 style={{ color: '#66bb6a', fontSize: 16, margin: '0 0 10px' }}>
          💤 {node.title}
        </h2>
        <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          {node.text}
        </p>
      </div>

      <div style={{
        display: 'flex', gap: 16, padding: '12px 16px',
        background: '#0a1a0a', border: '1px solid #1b5e20', borderRadius: 8,
        fontSize: 13,
      }}>
        {hpGain > 0 && <span style={{ color: '#ef5350' }}>HP +{hpGain} 회복</span>}
        {mpGain > 0 && <span style={{ color: '#7e57c2' }}>MP +{mpGain} 회복</span>}
        {hpGain === 0 && mpGain === 0 && <span style={{ color: '#555' }}>이미 최대치</span>}
      </div>

      <button
        onClick={doRest}
        style={{
          background: 'linear-gradient(135deg, #1b5e20, #66bb6a)',
          border: 'none', borderRadius: 8, padding: '14px',
          color: '#fff', fontWeight: 700, fontSize: 15,
          cursor: 'pointer', letterSpacing: 1,
        }}
      >
        휴식하고 계속
      </button>
    </div>
  );
}
