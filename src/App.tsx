import { useEffect, useRef, useState } from '@lynx-js/react';

import './theme/tokens.css';
import './App.css';

import { FloatingNav } from './components/FloatingNav.js';
import { InfoSheet } from './components/InfoSheet.js';
import { SourceLinkSheet } from './components/SourceLinkSheet.js';
import { Toast } from './components/Toast.js';
import { WelcomeScreen } from './components/WelcomeScreen.js';
import { openLink } from './native/link.js';
import { Home } from './pages/Home/Home.js';
import { ImanTracker } from './pages/ImanTracker/ImanTracker.js';
import { Library } from './pages/Library/Library.js';
import { AppProvider, useApp } from './state/AppProvider.js';
import type { Page } from './state/types.js';

function AppShell() {
  const { dispatch } = useApp();
  const [page, setPage] = useState<Page>('home');
  const [entered, setEntered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
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

  if (!entered) {
    return (
      <view className="app">
        <WelcomeScreen onEnter={() => setEntered(true)} />
      </view>
    );
  }

  return (
    <view className="app">
      <scroll-view key={page} className="app__scroll" scroll-y>
        <view className="app__content">
          {page === 'home' ? (
            <Home
              onNavigate={setPage}
              onMore={() => setShowInfo(true)}
              onRedirect={() => setEntered(false)}
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
          onClose={() => setShowInfo(false)}
          onOpenLink={openSource}
          onClearHistory={() => {
            dispatch({ type: 'CLEAR_HISTORY' });
            showToast('History cleared. The active day is unchanged.');
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
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
