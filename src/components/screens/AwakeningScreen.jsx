import { useGameStore } from '../../store/useGameStore.js';
import { ABILITIES } from '../../data/abilities.js';

const ABILITY_DESCS = {
  telekinesis:   { label: '염동력',   icon: '🌪', desc: '물리력으로 공간을 지배한다.\n높은 공격력, 공격 시 1.3× 보정', color: '#ef5350' },
  clairvoyance:  { label: '투시',     icon: '👁', desc: '적의 행동을 예측하고 회피한다.\n15% 자동 회피, 높은 정신력',   color: '#4fc3f7' },
  mind_control:  { label: '정신조작', icon: '🧠', desc: '적을 조종하거나 무력화한다.\n디버프 기술, 높은 제어력',         color: '#ce93d8' },
  regeneration:  { label: '재생',     icon: '💚', desc: '자신의 상처를 빠르게 회복한다.\n최고 HP, 회복 기술 보유',          color: '#66bb6a' },
};

export default function AwakeningScreen() {
  const { playerName, chooseAbility } = useGameStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '20px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#4fc3f7', margin: 0, fontSize: 22 }}>각성 능력 선택</h2>
        <p style={{ color: '#888', fontSize: 13, marginTop: 6 }}>
          {playerName} 요원, 당신 안에서 능력이 깨어납니다.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, width: '100%', maxWidth: 540 }}>
        {Object.entries(ABILITIES).map(([id, ab]) => {
          const d = ABILITY_DESCS[id];
          return (
            <button
              key={id}
              onClick={() => chooseAbility(id)}
              style={{
                background: '#0d0d1a',
                border: `2px solid ${d.color}44`,
                borderRadius: 10,
                padding: '18px 14px',
                cursor: 'pointer',
                textAlign: 'left',
                color: '#fff',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.background = '#12122a'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = d.color + '44'; e.currentTarget.style.background = '#0d0d1a'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{d.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: d.color, marginBottom: 6 }}>{d.label}</div>
              <div style={{ fontSize: 11, color: '#aaa', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{d.desc}</div>
              <div style={{ marginTop: 10, fontSize: 11, color: '#666', lineHeight: 1.6 }}>
                HP {ab.initHp} · MP {ab.initMp}<br />
                파워 {ab.initStats.power} · 제어 {ab.initStats.control} · 정신 {ab.initStats.mental}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
