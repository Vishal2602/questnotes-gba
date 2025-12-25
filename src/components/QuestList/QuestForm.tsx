import React, { useState, useEffect } from 'react';
import { Quest, Priority, Category, PRIORITY_CONFIG, CATEGORY_CONFIG } from '../../types';
import { useGame } from '../../context/GameContext';
import { PixelModal } from '../UI/PixelModal';
import { PixelInput, PixelTextarea, PixelSelect } from '../UI/PixelInput';
import { PixelButton } from '../UI/PixelButton';
import { v4 as uuidv4 } from 'uuid';
import './QuestForm.css';

interface QuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  quest?: Quest | null;
  defaultDungeonId?: string | null;
}

export function QuestForm({ isOpen, onClose, quest, defaultDungeonId }: QuestFormProps) {
  const { state, dispatch } = useGame();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Priority>('slime');
  const [category, setCategory] = useState<Category>('knight');
  const [dungeonId, setDungeonId] = useState<string | null>(null);

  // Reset form when modal opens/closes or quest changes
  useEffect(() => {
    if (isOpen) {
      if (quest) {
        // Editing existing quest
        setTitle(quest.title);
        setContent(quest.content);
        setPriority(quest.priority);
        setCategory(quest.category);
        setDungeonId(quest.dungeonId);
      } else {
        // New quest
        setTitle('');
        setContent('');
        setPriority('slime');
        setCategory('knight');
        setDungeonId(defaultDungeonId || null);
      }
    }
  }, [isOpen, quest, defaultDungeonId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (quest) {
      // Update existing
      const updatedQuest: Quest = {
        ...quest,
        title: title.trim(),
        content: content.trim(),
        priority,
        category,
        dungeonId,
        updatedAt: new Date().toISOString()
      };
      dispatch({ type: 'UPDATE_QUEST', payload: updatedQuest });
    } else {
      // Create new
      const newQuest: Quest = {
        id: uuidv4(),
        title: title.trim(),
        content: content.trim(),
        priority,
        category,
        dungeonId,
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dispatch({ type: 'ADD_QUEST', payload: newQuest });
    }

    onClose();
  };

  // Build options for selects
  const priorityOptions = Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
    value,
    label: `${config.emoji} ${config.label} (+${config.xp} XP)`
  }));

  const categoryOptions = Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({
    value,
    label: `${config.emoji} ${config.label}`
  }));

  const dungeonOptions = [
    { value: '', label: '🌲 Wilderness (No Dungeon)' },
    ...state.dungeons.map(d => ({
      value: d.id,
      label: `${d.icon} ${d.name}`
    }))
  ];

  return (
    <PixelModal
      isOpen={isOpen}
      onClose={onClose}
      title={quest ? 'Edit Quest' : 'New Quest'}
    >
      <form className="quest-form" onSubmit={handleSubmit}>
        <div className="pixel-modal__field">
          <label className="pixel-modal__label" htmlFor="quest-title">
            Quest Title *
          </label>
          <PixelInput
            id="quest-title"
            value={title}
            onChange={setTitle}
            placeholder="Slay the dragon..."
            maxLength={100}
            autoFocus
          />
        </div>

        <div className="pixel-modal__field">
          <label className="pixel-modal__label" htmlFor="quest-content">
            Quest Details
          </label>
          <PixelTextarea
            id="quest-content"
            value={content}
            onChange={setContent}
            placeholder="The dragon lives in the eastern mountains..."
            maxLength={2000}
            rows={4}
          />
        </div>

        <div className="quest-form__row">
          <div className="pixel-modal__field">
            <label className="pixel-modal__label" htmlFor="quest-priority">
              Difficulty
            </label>
            <PixelSelect
              id="quest-priority"
              value={priority}
              onChange={(v) => setPriority(v as Priority)}
              options={priorityOptions}
            />
          </div>

          <div className="pixel-modal__field">
            <label className="pixel-modal__label" htmlFor="quest-category">
              Type
            </label>
            <PixelSelect
              id="quest-category"
              value={category}
              onChange={(v) => setCategory(v as Category)}
              options={categoryOptions}
            />
          </div>
        </div>

        <div className="pixel-modal__field">
          <label className="pixel-modal__label" htmlFor="quest-dungeon">
            Dungeon
          </label>
          <PixelSelect
            id="quest-dungeon"
            value={dungeonId || ''}
            onChange={(v) => setDungeonId(v || null)}
            options={dungeonOptions}
          />
        </div>

        {/* Preview of XP reward */}
        <div className="quest-form__preview">
          <span className="quest-form__preview-label">Reward:</span>
          <span className="quest-form__preview-xp">
            +{PRIORITY_CONFIG[priority].xp} XP
          </span>
        </div>

        <div className="pixel-modal__actions">
          <PixelButton variant="ghost" type="button" onClick={onClose}>
            Cancel
          </PixelButton>
          <PixelButton
            variant="primary"
            type="submit"
            disabled={!title.trim()}
          >
            {quest ? 'Save Quest' : 'Create Quest'}
          </PixelButton>
        </div>
      </form>
    </PixelModal>
  );
}
