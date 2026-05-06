import { HashRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import ParticleBackground from './components/effects/ParticleBackground';
import HomePage from './pages/HomePage';
import SetupPage from './pages/SetupPage';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';
import WeeklyChallengePage from './pages/WeeklyChallengePage';
import CollectorPage from './pages/CollectorPage';

export default function App() {
  return (
    <GameProvider>
      <HashRouter>
        <ParticleBackground />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/play" element={<GamePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/weekly" element={<WeeklyChallengePage />} />
          <Route path="/collector" element={<CollectorPage />} />
        </Routes>
      </HashRouter>
    </GameProvider>
  );
}
