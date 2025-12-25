import { Character } from '../../types';
import { calculateLevelProgress, xpToNextLevel, getRankTitle } from '../../utils/xp';
import './XPBar.css';

interface XPBarProps {
  character: Character;
}

export function XPBar({ character }: XPBarProps) {
  const progress = calculateLevelProgress(character.xp);
  const xpNeeded = xpToNextLevel(character.xp);
  const rank = getRankTitle(character.level);

  return (
    <div className="xp-bar-container">
      <div className="xp-bar__info">
        <span className="xp-bar__level heading">Lv.{character.level}</span>
        <span className="xp-bar__rank">{rank}</span>
      </div>
      <div className="xp-bar">
        <div
          className="xp-bar__fill"
          style={{ width: `${progress}%` }}
        />
        <div className="xp-bar__segments">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="xp-bar__segment" />
          ))}
        </div>
      </div>
      <div className="xp-bar__text">
        <span className="xp-bar__xp">{xpNeeded} XP to next level</span>
      </div>
    </div>
  );
}
