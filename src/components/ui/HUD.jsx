import { useGameStore } from '../../store/useGameStore.js';
import StatBar from './StatBar.jsx';

export default function HUD() {
  const { hp, maxHp, mp, maxMp, stats, gold, faction, ability, equipment } = useGameStore();

  const factionLabel = faction > 20 ? 'AURA 성향'
    : faction < -20 ? 'Nexus 성향'
    : '중립';
  const factionColor = faction > 20 ? '#4fc3f7' : faction < -20 ? '#ce93d8' : '#aaa';
  const factionPct = ((faction + 100) / 200) * 100;

  return (
    <div style={{
      background: '#0d0d1a',
      border: '1px solid #1e1e3f',
      borderRadius: 8,
      padding: '12px 16px',
      fontSize: 12,
      color: '#ccc',
      minWidth: 200,
    }}>
      <StatBar label="HP" value={hp} max={maxHp} color="#ef5350" />
      <StatBar label="MP" value={mp} max={maxMp} color="#7e57c2" />

      <div style={{ marginTop: 10, marginBottom: 6, borderTop: '1px solid #1e1e3f', paddingTop: 8 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span>⚡ 파워 <b style={{ color: '#ffd54f' }}>{stats.power}</b></span>
          <span>🛡 제어 <b style={{ color: '#4fc3f7' }}>{stats.control}</b></span>
          <span>🧠 정신 <b style={{ color: '#ce93d8' }}>{stats.mental}</b></span>
        </div>
      </div>

      <div style={{ marginTop: 6, marginBottom: 6, borderTop: '1px solid #1e1e3f', paddingTop: 8 }}>
        <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span>Nexus</span>
          <span style={{ color: factionColor }}>{factionLabel}</span>
          <span>AURA</span>
        </div>
        <div style={{ height: 6, background: '#1a1a2e', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${factionPct}%`,
            background: `linear-gradient(to right, #ce93d8, #4fc3f7)`,
            borderRadius: 3,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
        <span>💰 {gold}G</span>
        {equipment.armor    && <span>🛡 {equipment.armor.name}</span>}
        {equipment.accessory && <span>💎 {equipment.accessory.name}</span>}
      </div>
    </div>
  );
}
