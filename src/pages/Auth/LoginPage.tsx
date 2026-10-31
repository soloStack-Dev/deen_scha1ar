import { useState } from '@lynx-js/react';

import art from '../../assets/auth/auth-01.jpg';
import { useAuth } from '../../auth/AuthProvider.js';
import { isValidEmail, normalizeEmail } from '../../auth/utils.js';
import { AuthField } from '../../components/AuthField.js';
import { AuthFrame } from './AuthFrame.js';

interface LoginPageProps {
  onBack: () => void;
  onSignup: () => void;
  onAuthenticated: () => void;
}

export function LoginPage({
  onBack,
  onSignup,
  onAuthenticated,
}: LoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function submit() {
    'background only';
    const result = signIn(email, password, remember);
    if (!result.ok) {
      setError(result.error ?? 'Unable to log in.');
      setNotice('');
      return;
    }
    setError('');
    onAuthenticated();
  }

  function forgotPassword() {
    'background only';
    if (!isValidEmail(email)) {
      setError('Enter your email first.');
      setNotice('');
      return;
    }
    setError('');
    setNotice(
      `If an account exists for ${normalizeEmail(email)}, a reset link would be sent.`,
    );
  }

  function socialUnavailable() {
    'background only';
    setError('');
    setNotice('Social sign-in needs the native mobile host.');
  }

  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <AuthFrame
      art={art}
      eyebrow="Welcome back"
      title="Ready to continue?"
      subtitle="Log in to keep your prayer, reading and daily routine together."
      onBack={onBack}
    >
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
        placeholder="Enter your password"
        type="password"
        onChange={setPassword}
        maxlength={80}
      />

      <view className="auth-row">
        <view className="auth-check" bindtap={() => setRemember((value) => !value)}>
          <view
            className={`auth-check__box ${
              remember ? 'auth-check__box--on' : ''
            }`}
          >
            <text className="auth-check__tick">{remember ? '✓' : ''}</text>
          </view>
          <text className="auth-check__label">Remember me</text>
        </view>
        <view bindtap={forgotPassword}>
          <text className="auth-link">Forgot password?</text>
        </view>
      </view>

      {error ? <text className="auth-error">{error}</text> : null}
      {notice ? <text className="auth-notice">{notice}</text> : null}

      <view
        className={`auth-button ${
          canSubmit ? '' : 'auth-button--disabled'
        }`}
        bindtap={submit}
      >
        <text className="auth-button__label">Log in</text>
      </view>

      <view className="auth-divider">
        <view className="auth-divider__line" />
        <text className="auth-divider__text">Sign in with</text>
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
        Social sign-in is available once the native host is connected.
      </text>

      <view className="auth-switch">
        <text className="auth-switch__text">Don&apos;t have an account? </text>
        <view bindtap={onSignup}>
          <text className="auth-switch__link">Sign up</text>
        </view>
      </view>
    </AuthFrame>
  );
}
