import { useState } from '@lynx-js/react';

interface InputEvent {
  detail: { value: string };
}

interface AuthFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  error?: string;
  maxlength?: number;
}

export function AuthField({
  label,
  value,
  placeholder,
  onChange,
  type = 'text',
  error,
  maxlength,
}: AuthFieldProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';

  function handleInput(event: InputEvent) {
    onChange(event.detail.value);
  }

  function handleFocus() {
    setFocused(true);
  }

  function handleBlur() {
    setFocused(false);
  }

  function toggleReveal() {
    setRevealed((current) => !current);
  }

  return (
    <view className="auth-field">
      <text className="auth-field__label">{label}</text>
      <view
        className={`auth-field__box ${
          focused ? 'auth-field__box--focused' : ''
        } ${error ? 'auth-field__box--error' : ''}`}
      >
        <input
          className="auth-field__input"
          type={isPassword && !revealed ? 'password' : type === 'email' ? 'email' : 'text'}
          default-value={value}
          placeholder={placeholder}
          maxlength={maxlength}
          bindinput={handleInput}
          bindfocus={handleFocus}
          bindblur={handleBlur}
        />
        {isPassword ? (
          <view className="auth-field__toggle" bindtap={toggleReveal}>
            <text className="auth-field__toggle-text">
              {revealed ? 'Hide' : 'Show'}
            </text>
          </view>
        ) : null}
      </view>
      {error ? <text className="auth-field__error">{error}</text> : null}
    </view>
  );
}
