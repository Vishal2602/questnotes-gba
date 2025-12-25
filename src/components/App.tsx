import { useState, useEffect } from 'react';
import { GameProvider } from '../context/GameContext';
import { Header } from './Layout/Header';
import { Sidebar } from './Layout/Sidebar';
import { QuestList } from './QuestList/QuestList';
import { BootScreen } from './BootScreen';
import './App.css';

function AppContent() {
  return (
    <div className="app">
      {/* Scanline overlay for CRT effect */}
      <div className="scanlines" />

      <Header />

      <div className="app__body">
        <Sidebar />
        <main className="app__main">
          <QuestList />
        </main>
      </div>
    </div>
  );
}

export function App() {
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('questnotes_visited');
    if (hasVisited) {
      setShowBoot(false);
    } else {
      // First visit - show boot screen
      const timer = setTimeout(() => {
        setShowBoot(false);
        localStorage.setItem('questnotes_visited', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (showBoot) {
    return <BootScreen onComplete={() => setShowBoot(false)} />;
  }

  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
