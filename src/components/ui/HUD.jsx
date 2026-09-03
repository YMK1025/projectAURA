import { useGameStore } from '../../store/useGameStore.js';
import StatBar from './StatBar.jsx';

const EXP_TABLE = [0, 100, 250, 450, 700, 1050, 1500];

export default function HUD() {
  const { hp, maxHp, mp, maxMp, stats, gold, faction, level, totalExp, equipment } = useGameStore();

  const factionLabel = faction > 20 ? 'AURA 성향' : faction < -20 ? 'Nexus 성향' : '중립';
  const factionColor = faction > 20 ? '#4fc3f7' : faction < -20 ? '#ce93d8' : '#aaa';
  const factionPct = ((faction + 100) / 200) * 100;

  const curThreshold = EXP_TABLE[Math.min(level - 1, EXP_TABLE.length - 1)] ?? 0;
  const nxtThreshold = EXP_TABLE[Math.min(level, EXP_TABLE.length - 1)] ?? curThreshold + 100;
  const expInLevel   = totalExp - curThreshold;
  const expNeeded    = nxtThreshold - curThreshold;
  const expPct       = Math.min(100, (expInLevel / expNeeded) * 100);

  return (
    <div style={{
      background: '#0d0d1a', border: '1px solid #1e1e3f',
      borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#ccc',
    }}>
      <StatBar label="HP" value={hp} max={maxHp} color="#ef5350" />
      <StatBar label="MP" value={mp} max={maxMp} color="#7e57c2" />

      {/* 레벨 & EXP */}
      <div style={{ marginTop: 8, marginBottom: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa', marginBottom: 2 }}>
          <span style={{ color: '#ffd54f', fontWeight: 700 }}>Lv.{level}</span>
          <span>EXP {expInLevel}/{expNeeded}</span>
        </div>
        <div style={{ height: 4, background: '#1a1a2e', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${expPct}%`,
            background: 'linear-gradient(to right, #ff9800, #ffd54f)',
            borderRadius: 2, transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* 스탯 */}
      <div style={{ marginTop: 8, borderTop: '1px solid #1e1e3f', paddingTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span>⚡ <b style={{ color: '#ffd54f' }}>{stats.power}</b></span>
        <span>🛡 <b style={{ color: '#4fc3f7' }}>{stats.control}</b></span>
        <span>🧠 <b style={{ color: '#ce93d8' }}>{stats.mental}</b></span>
      </div>

      {/* 진영 */}
      <div style={{ marginTop: 8, borderTop: '1px solid #1e1e3f', paddingTop: 8 }}>
        <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span>Nexus</span>
          <span style={{ color: factionColor }}>{factionLabel}</span>
          <span>AURA</span>
        </div>
        <div style={{ height: 5, background: '#1a1a2e', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${factionPct}%`,
            background: 'linear-gradient(to right, #ce93d8, #4fc3f7)',
            borderRadius: 2, transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* 골드 & 장비 */}
      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
        <span>💰 {gold}G</span>
        {equipment.armor     && <span title={equipment.armor.desc}>🛡 {equipment.armor.name}</span>}
        {equipment.accessory && <span title={equipment.accessory.desc}>💎 {equipment.accessory.name}</span>}
      </div>
    </div>
  );
}
