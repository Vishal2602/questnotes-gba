import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PixelButton } from '../UI/PixelButton';
import { PixelModal } from '../UI/PixelModal';
import { PixelInput } from '../UI/PixelInput';
import { Dungeon } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import './Sidebar.css';

const DUNGEON_ICONS = ['🏰', '⚔️', '🗡️', '🛡️', '💎', '🔮', '📚', '🎭', '🌙', '⭐', '🔥', '❄️', '🌿', '💀', '👻'];

export function Sidebar() {
  const { state, dispatch } = useGame();
  const [showNewDungeon, setShowNewDungeon] = useState(false);
  const [dungeonName, setDungeonName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🏰');
  const [editingDungeon, setEditingDungeon] = useState<Dungeon | null>(null);

  const handleCreateDungeon = () => {
    if (!dungeonName.trim()) return;

    const newDungeon: Dungeon = {
      id: uuidv4(),
      name: dungeonName.trim(),
      icon: selectedIcon,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_DUNGEON', payload: newDungeon });
    setDungeonName('');
    setSelectedIcon('🏰');
    setShowNewDungeon(false);
  };

  const handleUpdateDungeon = () => {
    if (!editingDungeon || !dungeonName.trim()) return;

    const updated: Dungeon = {
      ...editingDungeon,
      name: dungeonName.trim(),
      icon: selectedIcon
    };

    dispatch({ type: 'UPDATE_DUNGEON', payload: updated });
    setEditingDungeon(null);
    setDungeonName('');
    setSelectedIcon('🏰');
  };

  const handleDeleteDungeon = (id: string) => {
    dispatch({ type: 'DELETE_DUNGEON', payload: id });
    setEditingDungeon(null);
    setDungeonName('');
  };

  const startEditing = (dungeon: Dungeon) => {
    setEditingDungeon(dungeon);
    setDungeonName(dungeon.name);
    setSelectedIcon(dungeon.icon);
  };

  const getQuestCount = (dungeonId: string | null) => {
    return state.quests.filter(q => q.dungeonId === dungeonId && !q.completed).length;
  };

  const allQuestCount = state.quests.filter(q => !q.completed).length;
  const wildernessCount = getQuestCount(null);

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title heading">Dungeons</h2>
        <PixelButton
          variant="ghost"
          size="small"
          onClick={() => setShowNewDungeon(true)}
          title="New Dungeon"
        >
          +
        </PixelButton>
      </div>

      <nav className="sidebar__nav">
        {/* All Quests */}
        <button
          className={`sidebar__item ${state.selectedDungeonId === null && !state.selectedDungeonId ? 'sidebar__item--active' : ''}`}
          onClick={() => dispatch({ type: 'SELECT_DUNGEON', payload: null })}
        >
          <span className="sidebar__icon">🗺️</span>
          <span className="sidebar__name">All Quests</span>
          {allQuestCount > 0 && (
            <span className="sidebar__count">{allQuestCount}</span>
          )}
        </button>

        {/* Wilderness (uncategorized) */}
        <button
          className={`sidebar__item sidebar__item--wilderness ${state.selectedDungeonId === 'wilderness' ? 'sidebar__item--active' : ''}`}
          onClick={() => dispatch({ type: 'SELECT_DUNGEON', payload: 'wilderness' })}
        >
          <span className="sidebar__icon">🌲</span>
          <span className="sidebar__name">Wilderness</span>
          {wildernessCount > 0 && (
            <span className="sidebar__count">{wildernessCount}</span>
          )}
        </button>

        <div className="sidebar__divider" />

        {/* User dungeons */}
        {state.dungeons.map(dungeon => (
          <button
            key={dungeon.id}
            className={`sidebar__item ${state.selectedDungeonId === dungeon.id ? 'sidebar__item--active' : ''}`}
            onClick={() => dispatch({ type: 'SELECT_DUNGEON', payload: dungeon.id })}
            onContextMenu={(e) => {
              e.preventDefault();
              startEditing(dungeon);
            }}
          >
            <span className="sidebar__icon">{dungeon.icon}</span>
            <span className="sidebar__name">{dungeon.name}</span>
            {getQuestCount(dungeon.id) > 0 && (
              <span className="sidebar__count">{getQuestCount(dungeon.id)}</span>
            )}
          </button>
        ))}

        {state.dungeons.length === 0 && (
          <div className="sidebar__empty">
            <span className="sidebar__empty-icon">🏚️</span>
            <span className="sidebar__empty-text">No dungeons yet!</span>
            <span className="sidebar__empty-hint">Create one to organize your quests</span>
          </div>
        )}
      </nav>

      {/* New Dungeon Modal */}
      <PixelModal
        isOpen={showNewDungeon}
        onClose={() => {
          setShowNewDungeon(false);
          setDungeonName('');
          setSelectedIcon('🏰');
        }}
        title="Create Dungeon"
      >
        <div className="pixel-modal__form">
          <div className="pixel-modal__field">
            <label className="pixel-modal__label">Dungeon Name</label>
            <PixelInput
              value={dungeonName}
              onChange={setDungeonName}
              placeholder="Dark Cavern..."
              maxLength={30}
              autoFocus
            />
          </div>

          <div className="pixel-modal__field">
            <label className="pixel-modal__label">Icon</label>
            <div className="icon-picker">
              {DUNGEON_ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-picker__item ${selectedIcon === icon ? 'icon-picker__item--selected' : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="pixel-modal__actions">
            <PixelButton variant="ghost" onClick={() => setShowNewDungeon(false)}>
              Cancel
            </PixelButton>
            <PixelButton
              variant="primary"
              onClick={handleCreateDungeon}
              disabled={!dungeonName.trim()}
            >
              Create
            </PixelButton>
          </div>
        </div>
      </PixelModal>

      {/* Edit Dungeon Modal */}
      <PixelModal
        isOpen={!!editingDungeon}
        onClose={() => {
          setEditingDungeon(null);
          setDungeonName('');
          setSelectedIcon('🏰');
        }}
        title="Edit Dungeon"
      >
        <div className="pixel-modal__form">
          <div className="pixel-modal__field">
            <label className="pixel-modal__label">Dungeon Name</label>
            <PixelInput
              value={dungeonName}
              onChange={setDungeonName}
              placeholder="Dark Cavern..."
              maxLength={30}
            />
          </div>

          <div className="pixel-modal__field">
            <label className="pixel-modal__label">Icon</label>
            <div className="icon-picker">
              {DUNGEON_ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-picker__item ${selectedIcon === icon ? 'icon-picker__item--selected' : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="pixel-modal__actions">
            <PixelButton
              variant="danger"
              onClick={() => editingDungeon && handleDeleteDungeon(editingDungeon.id)}
            >
              Delete
            </PixelButton>
            <PixelButton variant="ghost" onClick={() => setEditingDungeon(null)}>
              Cancel
            </PixelButton>
            <PixelButton
              variant="primary"
              onClick={handleUpdateDungeon}
              disabled={!dungeonName.trim()}
            >
              Save
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </aside>
  );
}
