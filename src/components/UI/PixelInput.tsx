import './PixelInput.css';

interface PixelInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
  disabled?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  id?: string;
  name?: string;
}

export function PixelInput({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  maxLength,
  autoFocus = false,
  id,
  name
}: PixelInputProps) {
  return (
    <div className="pixel-input-wrapper">
      <input
        type={type}
        className="pixel-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoFocus={autoFocus}
        id={id}
        name={name}
      />
    </div>
  );
}

interface PixelTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  autoFocus?: boolean;
  id?: string;
  name?: string;
}

export function PixelTextarea({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  maxLength,
  rows = 4,
  autoFocus = false,
  id,
  name
}: PixelTextareaProps) {
  return (
    <div className="pixel-input-wrapper">
      <textarea
        className="pixel-input pixel-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        autoFocus={autoFocus}
        id={id}
        name={name}
      />
    </div>
  );
}

interface PixelSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  id?: string;
  name?: string;
}

export function PixelSelect({
  value,
  onChange,
  options,
  disabled = false,
  id,
  name
}: PixelSelectProps) {
  return (
    <div className="pixel-input-wrapper">
      <select
        className="pixel-input pixel-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        id={id}
        name={name}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
