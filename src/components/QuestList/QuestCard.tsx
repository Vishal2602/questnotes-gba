import { MouseEvent } from 'react';
import { Quest, PRIORITY_CONFIG, CATEGORY_CONFIG } from '../../types';
import { useGame } from '../../context/GameContext';
import { PixelButton } from '../UI/PixelButton';
import './QuestCard.css';

interface QuestCardProps {
  quest: Quest;
  onEdit: (quest: Quest) => void;
  index: number;
}

export function QuestCard({ quest, onEdit, index }: QuestCardProps) {
  const { dispatch } = useGame();

  const priorityConfig = PRIORITY_CONFIG[quest.priority];
  const categoryConfig = CATEGORY_CONFIG[quest.category];

  const handleComplete = (e: MouseEvent) => {
    e.stopPropagation();
    if (quest.completed) {
      dispatch({ type: 'UNCOMPLETE_QUEST', payload: quest.id });
    } else {
      dispatch({ type: 'COMPLETE_QUEST', payload: quest.id });
    }
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_QUEST', payload: quest.id });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className={`quest-card quest-card--${quest.priority} ${quest.completed ? 'quest-card--completed' : ''}`}
      style={{
        animationDelay: `${index * 50}ms`,
        borderLeftColor: priorityConfig.color
      }}
      onClick={() => onEdit(quest)}
    >
      {/* Completion checkbox */}
      <button
        className={`quest-card__check ${quest.completed ? 'quest-card__check--done' : ''}`}
        onClick={handleComplete}
        title={quest.completed ? 'Mark as incomplete' : 'Complete quest'}
      >
        {quest.completed ? '✓' : ''}
      </button>

      <div className="quest-card__content">
        {/* Header row */}
        <div className="quest-card__header">
          <span
            className="quest-card__category"
            style={{ color: categoryConfig.color }}
          >
            {categoryConfig.emoji} {categoryConfig.label}
          </span>
          <span
            className="quest-card__priority"
            style={{ backgroundColor: priorityConfig.color }}
          >
            {priorityConfig.emoji} {priorityConfig.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="quest-card__title">{quest.title}</h3>

        {/* Content preview */}
        {quest.content && (
          <p className="quest-card__preview">
            {quest.content.length > 100
              ? quest.content.substring(0, 100) + '...'
              : quest.content}
          </p>
        )}

        {/* Footer */}
        <div className="quest-card__footer">
          <span className="quest-card__date">
            {quest.completed && quest.completedAt
              ? `✓ ${formatDate(quest.completedAt)}`
              : formatDate(quest.createdAt)}
          </span>
          <span className="quest-card__xp">
            +{priorityConfig.xp} XP
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="quest-card__actions">
        <PixelButton
          variant="ghost"
          size="small"
          onClick={() => onEdit(quest)}
          title="Edit quest"
        >
          ✏️
        </PixelButton>
        <PixelButton
          variant="ghost"
          size="small"
          onClick={handleDelete}
          title="Delete quest"
        >
          🗑️
        </PixelButton>
      </div>
    </div>
  );
}
