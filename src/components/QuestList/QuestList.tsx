import { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { Quest, Priority, Category } from '../../types';
import { QuestCard } from './QuestCard';
import { QuestForm } from './QuestForm';
import { PixelButton } from '../UI/PixelButton';
import { PixelSelect } from '../UI/PixelInput';
import './QuestList.css';

type SortOption = 'newest' | 'oldest' | 'priority' | 'category';
type FilterOption = 'all' | 'active' | 'completed';

export function QuestList() {
  const { state } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Filter quests based on selected dungeon
  const filteredByDungeon = useMemo(() => {
    if (state.selectedDungeonId === null) {
      return state.quests; // Show all
    }
    if (state.selectedDungeonId === 'wilderness') {
      return state.quests.filter(q => q.dungeonId === null);
    }
    return state.quests.filter(q => q.dungeonId === state.selectedDungeonId);
  }, [state.quests, state.selectedDungeonId]);

  // Apply status filter
  const filteredByStatus = useMemo(() => {
    switch (filterBy) {
      case 'active':
        return filteredByDungeon.filter(q => !q.completed);
      case 'completed':
        return filteredByDungeon.filter(q => q.completed);
      default:
        return filteredByDungeon;
    }
  }, [filteredByDungeon, filterBy]);

  // Apply sorting
  const sortedQuests = useMemo(() => {
    const priorityOrder: Record<Priority, number> = { dragon: 0, goblin: 1, slime: 2 };
    const categoryOrder: Record<Category, number> = { knight: 0, mage: 1, bard: 2, rogue: 3 };

    return [...filteredByStatus].sort((a, b) => {
      // Completed quests always go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'category':
          return categoryOrder[a.category] - categoryOrder[b.category];
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [filteredByStatus, sortBy]);

  const handleEdit = (quest: Quest) => {
    setEditingQuest(quest);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingQuest(null);
  };

  const getCurrentDungeonName = () => {
    if (state.selectedDungeonId === null) return 'All Quests';
    if (state.selectedDungeonId === 'wilderness') return 'Wilderness';
    const dungeon = state.dungeons.find(d => d.id === state.selectedDungeonId);
    return dungeon ? dungeon.name : 'Quests';
  };

  const sortOptions = [
    { value: 'newest', label: '📅 Newest First' },
    { value: 'oldest', label: '📅 Oldest First' },
    { value: 'priority', label: '⚔️ By Priority' },
    { value: 'category', label: '📂 By Category' }
  ];

  const filterOptions = [
    { value: 'all', label: '📜 All Quests' },
    { value: 'active', label: '⚔️ Active' },
    { value: 'completed', label: '✓ Completed' }
  ];

  return (
    <div className="quest-list">
      <div className="quest-list__header">
        <div className="quest-list__title-row">
          <h2 className="quest-list__title heading">{getCurrentDungeonName()}</h2>
          <span className="quest-list__count">
            {sortedQuests.filter(q => !q.completed).length} active / {sortedQuests.length} total
          </span>
        </div>

        <div className="quest-list__controls">
          <div className="quest-list__filters">
            <PixelSelect
              value={filterBy}
              onChange={(v) => setFilterBy(v as FilterOption)}
              options={filterOptions}
            />
            <PixelSelect
              value={sortBy}
              onChange={(v) => setSortBy(v as SortOption)}
              options={sortOptions}
            />
          </div>
          <PixelButton
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            + New Quest
          </PixelButton>
        </div>
      </div>

      <div className="quest-list__content">
        {sortedQuests.length === 0 ? (
          <div className="quest-list__empty">
            <div className="quest-list__empty-icon">📜</div>
            <h3 className="quest-list__empty-title heading">No Quests Yet!</h3>
            <p className="quest-list__empty-text">
              Every adventure starts with a single quest.
              <br />
              Create your first one to begin your journey!
            </p>
            <PixelButton variant="primary" onClick={() => setShowForm(true)}>
              + Create First Quest
            </PixelButton>
          </div>
        ) : (
          <div className="quest-list__grid">
            {sortedQuests.map((quest, index) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onEdit={handleEdit}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quest Form Modal */}
      <QuestForm
        isOpen={showForm}
        onClose={handleClose}
        quest={editingQuest}
        defaultDungeonId={state.selectedDungeonId === 'wilderness' ? null : state.selectedDungeonId}
      />
    </div>
  );
}
