import { useState } from '@lynx-js/react';

import art from '../../assets/auth/auth-02.jpg';
import { useAuth } from '../../auth/AuthProvider.js';
import { passwordStrength, passwordStrengthLabel } from '../../auth/utils.js';
import { AuthField } from '../../components/AuthField.js';
import { AuthFrame } from './AuthFrame.js';

interface SignupPageProps {
  onBack: () => void;
  onLogin: () => void;
  onAuthenticated: () => void;
}

export function SignupPage({
  onBack,
  onLogin,
  onAuthenticated,
}: SignupPageProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const strength = passwordStrength(password);

  function submit() {
    'background only';
    if (!terms) {
      setError('Please accept the terms to continue.');
      setNotice('');
      return;
    }
    const result = signUp(name, email, password, true);
    if (!result.ok) {
      setError(result.error ?? 'Unable to create your account.');
      setNotice('');
      return;
    }
    setError('');
    onAuthenticated();
  }

  function socialUnavailable() {
    'background only';
    setError('');
    setNotice('Social sign-up needs the native mobile host.');
  }

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    terms;

  return (
    <AuthFrame
      art={art}
      eyebrow="Create account"
      title="Start your rhythm"
      subtitle="Keep your prayer log, streak and reading in one calm place."
      onBack={onBack}
    >
      <AuthField
        label="Full name"
        value={name}
        placeholder="Your name"
        onChange={setName}
        maxlength={60}
        error={name.length > 0 && name.trim().length < 2 ? 'Enter your name.' : undefined}
      />
      <AuthField
        label="Email"
        value={email}
        placeholder="you@example.com"
        type="email"
        onChange={setEmail}
        maxlength={120}
      />
      <AuthField
        label="Password"
        value={password}
        placeholder="8+ characters"
        type="password"
        onChange={setPassword}
        maxlength={80}
      />

      <view className="auth-strength">
        {[1, 2, 3, 4].map((step) => (
          <view
            key={step}
            className={`auth-strength__bar ${
              step <= strength ? `auth-strength__bar--${strength}` : ''
            }`}
          />
        ))}
      </view>
      <text className="auth-strength__label">
        {passwordStrengthLabel(strength)}
      </text>

      <view className="auth-check auth-check--terms" bindtap={() => setTerms((value) => !value)}>
        <view
          className={`auth-check__box ${terms ? 'auth-check__box--on' : ''}`}
        >
          <text className="auth-check__tick">{terms ? '✓' : ''}</text>
        </view>
        <text className="auth-check__label">
          I agree to the Terms &amp; Privacy Policy
        </text>
      </view>

      {error ? <text className="auth-error">{error}</text> : null}
      {notice ? <text className="auth-notice">{notice}</text> : null}

      <view
        className={`auth-button ${
          canSubmit ? '' : 'auth-button--disabled'
        }`}
        bindtap={submit}
      >
        <text className="auth-button__label">Get started</text>
      </view>

      <view className="auth-divider">
        <view className="auth-divider__line" />
        <text className="auth-divider__text">Sign up with</text>
        <view className="auth-divider__line" />
      </view>

      <view className="auth-socials">
        <view className="auth-social" bindtap={socialUnavailable}>
          <text className="auth-social__glyph">f</text>
        </view>
        <view className="auth-social" bindtap={socialUnavailable}>
          <text className="auth-social__glyph">G</text>
        </view>
        <view className="auth-social" bindtap={socialUnavailable}>
          <text className="auth-social__glyph">A</text>
        </view>
      </view>
      <text className="auth-social-note">
        Social sign-up is available once the native host is connected.
      </text>

      <view className="auth-switch">
        <text className="auth-switch__text">Already have an account? </text>
        <view bindtap={onLogin}>
          <text className="auth-switch__link">Log in</text>
        </view>
      </view>
    </AuthFrame>
  );
}
