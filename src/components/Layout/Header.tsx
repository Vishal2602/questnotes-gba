import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { XPBar } from '../Character/XPBar';
import { Companion } from '../Character/Companion';
import { PixelButton } from '../UI/PixelButton';
import { PixelModal } from '../UI/PixelModal';
import { PixelInput, PixelSelect } from '../UI/PixelInput';
import { CompanionType, COMPANION_CONFIG, ACHIEVEMENTS } from '../../types';
import './Header.css';

export function Header() {
  const { state, dispatch } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [tempName, setTempName] = useState(state.character.name);

  const completedQuests = state.quests.filter(q => q.completed).length;
  const totalQuests = state.quests.length;

  const handleNameSave = () => {
    if (tempName.trim()) {
      dispatch({ type: 'SET_CHARACTER_NAME', payload: tempName.trim() });
    }
    setShowSettings(false);
  };

  const handleCompanionChange = (companion: string) => {
    dispatch({ type: 'SET_COMPANION', payload: companion as CompanionType });
  };

  const companionOptions = Object.entries(COMPANION_CONFIG).map(([value, config]) => ({
    value,
    label: `${config.emoji} ${config.label}`
  }));

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__title-group">
          <h1 className="header__title heading">
            <span className="header__icon">📜</span>
            QuestNotes
          </h1>
          <span className="header__subtitle">16-Bit Note Adventure</span>
        </div>
      </div>

      <div className="header__center">
        <Companion
          character={state.character}
          quests={state.quests}
          onClick={() => setShowSettings(true)}
        />
      </div>

      <div className="header__right">
        <div className="header__stats">
          <div className="header__stat">
            <span className="header__stat-label">Quests</span>
            <span className="header__stat-value">{completedQuests}/{totalQuests}</span>
          </div>
        </div>
        <XPBar character={state.character} />
        <div className="header__actions">
          <PixelButton
            variant="ghost"
            size="small"
            onClick={() => setShowAchievements(true)}
            title="Achievements"
          >
            🏆 {state.character.achievements.length}
          </PixelButton>
          <PixelButton
            variant="ghost"
            size="small"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            ⚙️
          </PixelButton>
        </div>
      </div>

      {/* Settings Modal */}
      <PixelModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Hero Settings"
      >
        <div className="pixel-modal__form">
          <div className="pixel-modal__field">
            <label className="pixel-modal__label">Hero Name</label>
            <PixelInput
              value={tempName}
              onChange={setTempName}
              placeholder="Enter your name..."
              maxLength={20}
            />
          </div>

          <div className="pixel-modal__field">
            <label className="pixel-modal__label">Companion</label>
            <PixelSelect
              value={state.character.companion}
              onChange={handleCompanionChange}
              options={companionOptions}
            />
          </div>

          <div className="pixel-modal__field">
            <label className="pixel-modal__label">Sound Effects</label>
            <PixelButton
              variant={state.soundEnabled ? 'success' : 'secondary'}
              onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
              fullWidth
            >
              {state.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
            </PixelButton>
          </div>

          <div className="pixel-modal__actions">
            <PixelButton variant="ghost" onClick={() => setShowSettings(false)}>
              Cancel
            </PixelButton>
            <PixelButton variant="primary" onClick={handleNameSave}>
              Save
            </PixelButton>
          </div>
        </div>
      </PixelModal>

      {/* Achievements Modal */}
      <PixelModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        title="Achievements"
      >
        <div className="achievements-list">
          {ACHIEVEMENTS.map(achievement => {
            const unlocked = state.character.achievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`achievement ${unlocked ? 'achievement--unlocked' : 'achievement--locked'}`}
              >
                <span className="achievement__icon">{achievement.emoji}</span>
                <div className="achievement__info">
                  <span className="achievement__name">{achievement.name}</span>
                  <span className="achievement__desc">{achievement.description}</span>
                </div>
                {unlocked && <span className="achievement__check">✓</span>}
              </div>
            );
          })}
        </div>
      </PixelModal>
    </header>
  );
}
