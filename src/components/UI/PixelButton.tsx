import { ReactNode } from 'react';
import './PixelButton.css';

interface PixelButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  title?: string;
}

export function PixelButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  title
}: PixelButtonProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={`pixel-button pixel-button--${variant} pixel-button--${size} ${fullWidth ? 'pixel-button--full' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      title={title}
    >
      <span className="pixel-button__content">{children}</span>
    </button>
  );
}
