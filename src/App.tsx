import { useEffect, useRef, useState } from '@lynx-js/react';

import './theme/tokens.css';
import './App.css';

import { AuthProvider, useAuth } from './auth/AuthProvider.js';
import { FloatingNav } from './components/FloatingNav.js';
import { InfoSheet } from './components/InfoSheet.js';
import { ProfileSheet } from './components/ProfileSheet.js';
import { SourceLinkSheet } from './components/SourceLinkSheet.js';
import { Toast } from './components/Toast.js';
import { WelcomeScreen } from './components/WelcomeScreen.js';
import { openLink } from './native/link.js';
import { LoginPage } from './pages/Auth/LoginPage.js';
import { SignupPage } from './pages/Auth/SignupPage.js';
import { Home } from './pages/Home/Home.js';
import { ImanTracker } from './pages/ImanTracker/ImanTracker.js';
import { Library } from './pages/Library/Library.js';
import { AppProvider, useApp } from './state/AppProvider.js';
import type { Page } from './state/types.js';

type Route = 'welcome' | 'login' | 'signup' | 'app';

function AppShell() {
  const { dispatch } = useApp();
  const { user, hydrated, signOut, deleteAccount, updateAvatar } = useAuth();
  const [route, setRoute] = useState<Route>('welcome');
  const [page, setPage] = useState<Page>('home');
  const [showInfo, setShowInfo] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sourceLink, setSourceLink] = useState<{ label: string; url: string } | null>(
    null,
  );
  const [toast, setToast] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    'background only';
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function showToast(message: string) {
    'background only';
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2400);
  }

  function openSource(url: string, label: string) {
    'background only';
    if (!openLink(url)) setSourceLink({ label, url });
  }

  if (!hydrated) {
    return (
      <view className="app app--splash">
        <text className="app__splash-wordmark">Deensch1ar</text>
        <text className="app__splash-text">Preparing your space</text>
      </view>
    );
  }

  if (route === 'welcome') {
    return (
      <view className="app">
        <WelcomeScreen
          onEnter={() => setRoute(user ? 'app' : 'login')}
        />
      </view>
    );
  }

  if (route === 'login') {
    return (
      <view className="app">
        <LoginPage
          onBack={() => setRoute('welcome')}
          onSignup={() => setRoute('signup')}
          onAuthenticated={() => {
            setPage('home');
            setRoute('app');
          }}
        />
      </view>
    );
  }

  if (route === 'signup') {
    return (
      <view className="app">
        <SignupPage
          onBack={() => setRoute('welcome')}
          onLogin={() => setRoute('login')}
          onAuthenticated={() => {
            setPage('home');
            setRoute('app');
          }}
        />
      </view>
    );
  }

  return (
    <view className="app">
      <scroll-view key={page} className="app__scroll" scroll-y>
        <view className="app__content">
          {page === 'home' ? (
            <Home
              userName={user?.name ?? 'Faleel'}
              onNavigate={setPage}
              onMore={() => setShowInfo(true)}
              onProfile={() => {
                setShowInfo(false);
                setShowProfile(true);
              }}
              onRedirect={() => setRoute('welcome')}
            />
          ) : null}
          {page === 'iman' ? (
            <ImanTracker onToast={showToast} onOpenLink={openSource} />
          ) : null}
          {page === 'library' ? (
            <Library onOpenLink={openSource} />
          ) : null}
        </view>
      </scroll-view>

      <FloatingNav page={page} onChange={setPage} />

      {showInfo ? (
        <InfoSheet
          userName={user?.name ?? 'Faleel'}
          userEmail={user?.email ?? ''}
          onClose={() => setShowInfo(false)}
          onOpenLink={openSource}
          onSignOut={() => {
            signOut();
            setShowInfo(false);
            setPage('home');
            setRoute('login');
          }}
          onClearHistory={() => {
            dispatch({ type: 'CLEAR_HISTORY' });
            showToast('History cleared. The active day is unchanged.');
          }}
        />
      ) : null}

      {showProfile ? (
        <ProfileSheet
          userName={user?.name ?? 'Faleel'}
          userEmail={user?.email ?? ''}
          avatar={user?.avatar}
          onClose={() => setShowProfile(false)}
          onUpdateAvatar={updateAvatar}
          onSignOut={() => {
            signOut();
            setShowProfile(false);
            setPage('home');
            setRoute('login');
          }}
          onDeleteAccount={() => {
            deleteAccount();
            setShowProfile(false);
            setPage('home');
            setRoute('login');
          }}
        />
      ) : null}

      {sourceLink ? (
        <SourceLinkSheet
          label={sourceLink.label}
          url={sourceLink.url}
          onClose={() => setSourceLink(null)}
        />
      ) : null}

      <Toast message={toast} />
    </view>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </AuthProvider>
  );
}
