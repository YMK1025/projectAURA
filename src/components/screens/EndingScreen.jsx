import { useGameStore } from '../../store/useGameStore.js';

const ENDINGS = {
  aura: {
    title: 'AURA의 방패',
    color: '#4fc3f7',
    text: `Echo가 쓰러진다.\n\n당신은 AURA의 요원으로서 임무를 완수했다. Nexus는 와해되고, 세뇌된 초능력자들은 치료를 받는다.\n\n지유가 당신의 어깨에 손을 얹는다.\n\n"잘 했어요. 이제 진짜 시작이에요. 안에서 바꾸는 것은 — 밖에서 무너뜨리는 것보다 훨씬 더 어렵습니다."\n\n처분 명단에서 당신의 이름이 지워졌다. 하지만 당신은 안다. AURA가 완전히 깨끗해지기까지 아직 갈 길이 멀다는 것을.`,
    sub: '엔딩 A: 내부로부터의 변화',
  },
  nexus: {
    title: '자유의 불꽃',
    color: '#ce93d8',
    text: `강 국장이 무너진다.\n\n당신이 탈취한 서버 데이터가 전 세계에 공개됐다. 처분 명단, 격리 기록, 기억 소거 보고서.\n\n AURA는 해체 위기에 몰린다. 격리실의 문이 열리고, 수십 명의 초능력자들이 빛 속으로 나온다.\n\n카이가 처음으로 환하게 웃는다.\n\n"해냈어."\n\n세상은 아직 초능력자를 두려워한다. 하지만 이제 — 그 두려움에 감추어진 진실도 함께 알게 됐다.`,
    sub: '엔딩 B: 혁명의 대가',
  },
};

export default function EndingScreen() {
  const { endingType, playerName, stats, resetGame } = useGameStore();
  const ending = ENDINGS[endingType] ?? ENDINGS.aura;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 20, padding: '10px 0',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: ending.color, marginBottom: 6 }}>
          {ending.sub}
        </div>
        <h1 style={{
          fontSize: 28, color: '#fff', margin: 0,
          textShadow: `0 0 20px ${ending.color}`,
        }}>
          {ending.title}
        </h1>
      </div>

      <div style={{
        background: '#0d0d1a', border: `1px solid ${ending.color}55`,
        borderRadius: 10, padding: '20px 24px', maxWidth: 480, width: '100%',
      }}>
        <p style={{
          color: '#ddd', fontSize: 13, lineHeight: 1.9, whiteSpace: 'pre-line', margin: 0,
        }}>
          {ending.text}
        </p>
      </div>

      <div style={{
        background: '#0a0a18', border: '1px solid #2a2a4e',
        borderRadius: 8, padding: '14px 20px', width: '100%', maxWidth: 480,
        fontSize: 12, color: '#888',
      }}>
        <div style={{ color: '#ddd', fontWeight: 700, marginBottom: 8 }}>
          {playerName} 요원 최종 기록
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <span>파워 <b style={{ color: '#ffd54f' }}>{stats.power}</b></span>
          <span>제어 <b style={{ color: '#4fc3f7' }}>{stats.control}</b></span>
          <span>정신 <b style={{ color: '#ce93d8' }}>{stats.mental}</b></span>
        </div>
      </div>

      <button
        onClick={resetGame}
        style={{
          background: 'transparent',
          border: `1px solid ${ending.color}`,
          borderRadius: 8, padding: '12px 40px',
          color: ending.color, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', letterSpacing: 2,
        }}
      >
        처음부터 다시
      </button>
    </div>
  );
}
