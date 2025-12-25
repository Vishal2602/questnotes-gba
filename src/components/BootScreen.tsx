import { useState, useEffect } from 'react';
import './BootScreen.css';

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<'logo' | 'text' | 'fade'>('logo');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('text'), 800),
      setTimeout(() => setPhase('fade'), 2500),
      setTimeout(() => onComplete(), 3000)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className={`boot-screen boot-screen--${phase}`}>
      <div className="boot-screen__content">
        {/* GBA-style logo */}
        <div className="boot-screen__logo">
          <span className="boot-screen__icon">📜</span>
        </div>

        {/* Title reveal */}
        <h1 className="boot-screen__title heading">
          QuestNotes
        </h1>

        {/* Subtitle */}
        {phase !== 'logo' && (
          <p className="boot-screen__subtitle">
            16-Bit Note Taking Adventure
          </p>
        )}

        {/* Loading bar */}
        {phase !== 'logo' && (
          <div className="boot-screen__loading">
            <div className="boot-screen__loading-bar" />
          </div>
        )}

        {/* Skip hint */}
        <button
          className="boot-screen__skip"
          onClick={onComplete}
        >
          Press START
        </button>
      </div>

      {/* Corner decorations */}
      <div className="boot-screen__corner boot-screen__corner--tl">◤</div>
      <div className="boot-screen__corner boot-screen__corner--tr">◥</div>
      <div className="boot-screen__corner boot-screen__corner--bl">◣</div>
      <div className="boot-screen__corner boot-screen__corner--br">◢</div>
    </div>
  );
}
