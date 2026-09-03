import { useGameStore } from './store/useGameStore.js';
import HUD from './components/ui/HUD.jsx';
import TitleScreen     from './components/screens/TitleScreen.jsx';
import AwakeningScreen from './components/screens/AwakeningScreen.jsx';
import StoryScreen     from './components/screens/StoryScreen.jsx';
import CombatScreen    from './components/screens/CombatScreen.jsx';
import ShopScreen      from './components/screens/ShopScreen.jsx';
import RestScreen      from './components/screens/RestScreen.jsx';
import EventScreen     from './components/screens/EventScreen.jsx';
import EndingScreen    from './components/screens/EndingScreen.jsx';
import GameOverScreen  from './components/screens/GameOverScreen.jsx';

const SCREEN_MAP = {
  title:     TitleScreen,
  awakening: AwakeningScreen,
  story:     StoryScreen,
  combat:    CombatScreen,
  shop:      ShopScreen,
  rest:      RestScreen,
  event:     EventScreen,
  ending:    EndingScreen,
  gameover:  GameOverScreen,
};

export default function App() {
  const screen = useGameStore(s => s.screen);
  const showHud = !['title', 'awakening', 'ending', 'gameover'].includes(screen);

  const Screen = SCREEN_MAP[screen] ?? TitleScreen;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070711',
      display: 'flex',
      justifyContent: 'center',
      padding: '16px 8px 40px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 680,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 0', borderBottom: '1px solid #1e1e3f',
        }}>
          <span style={{
            fontWeight: 900, letterSpacing: 4, fontSize: 14,
            color: '#4fc3f7', textShadow: '0 0 10px #4fc3f7',
          }}>
            PROJECT AURA
          </span>
          {showHud && <span style={{ fontSize: 11, color: '#555' }}>{screen.toUpperCase()}</span>}
        </div>

        {/* HUD */}
        {showHud && <HUD />}

        {/* 메인 컨텐츠 */}
        <div style={{
          background: '#0a0a18',
          border: '1px solid #1a1a3f',
          borderRadius: 12,
          padding: '20px',
          flex: 1,
          minHeight: 400,
        }}>
          <Screen />
        </div>
      </div>
    </div>
  );
}
