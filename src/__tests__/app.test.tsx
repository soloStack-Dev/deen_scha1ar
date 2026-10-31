import '@testing-library/jest-dom';
import { fireEvent as domFireEvent } from '@testing-library/dom';
import { fireEvent, render } from '@lynx-js/react/testing-library';
import { beforeEach, expect, rs, test } from '@rstest/core';

import { App } from '../App.js';
import { ProfileSheet } from '../components/ProfileSheet.js';
import { SourceLinkSheet } from '../components/SourceLinkSheet.js';
import { __resetMemoryStorageForTests } from '../native/storage.js';
import { Home } from '../pages/Home/Home.js';
import { AppProvider } from '../state/AppProvider.js';

beforeEach(() => {
  __resetMemoryStorageForTests();
});

function renderHome(overrides: {
  onNavigate?: (page: string) => void;
  onMore?: () => void;
  onProfile?: () => void;
  onRedirect?: () => void;
} = {}) {
  return render(
    <AppProvider>
      <Home
        userName="Faleel"
        onNavigate={overrides.onNavigate ?? (() => {})}
        onMore={overrides.onMore ?? (() => {})}
        onProfile={overrides.onProfile}
        onRedirect={overrides.onRedirect ?? (() => {})}
      />
    </AppProvider>,
  );
}

function typeInto(element: HTMLElement, value: string) {
  const event = new Event('bindEvent:input');
  Object.assign(event, {
    eventType: 'bindEvent',
    eventName: 'input',
    detail: { value },
  });
  domFireEvent(element, event);
}

test('welcome opens the login page before the app', async () => {
  const { findByText } = render(<App />);
  fireEvent.tap(await findByText('Go to page'));

  expect(await findByText('Ready to continue?')).toBeInTheDocument();
  expect(await findByText('Log in')).toBeInTheDocument();
});

test('login links to the signup page', async () => {
  const { findByText } = render(<App />);
  fireEvent.tap(await findByText('Go to page'));
  fireEvent.tap(await findByText('Sign up'));

  expect(await findByText('Start your rhythm')).toBeInTheDocument();
  expect(await findByText('Get started')).toBeInTheDocument();
});

test('creating an account lands on the home page as that user', async () => {
  const { container, findAllByText, findByPlaceholderText, findByText } = render(
    <App />,
  );
  fireEvent.tap(await findByText('Go to page'));
  fireEvent.tap(await findByText('Sign up'));

  const name = await findByPlaceholderText('Your name');
  const email = await findByPlaceholderText('you@example.com');
  const password = await findByPlaceholderText('8+ characters');

  typeInto(name, 'Faleel');
  typeInto(email, 'faleel@example.com');
  typeInto(password, 'deen1234');
  fireEvent.tap(await findByText('I agree to the Terms & Privacy Policy'));
  fireEvent.tap(await findByText('Get started'));

  expect(await findByText('Faleel')).toBeInTheDocument();
  expect(await findByText("Today's iman")).toBeInTheDocument();

  fireEvent.tap(container.querySelector('.header__avatar')!);
  expect(await findAllByText('faleel@example.com')).not.toHaveLength(0);
  fireEvent.tap(await findByText('Settings'));
  fireEvent.tap(await findByText('Log out'));

  expect(await findByText('Ready to continue?')).toBeInTheDocument();
});

test('home renders the iman hero and daily spark', async () => {
  const { findByText } = renderHome();

  expect(await findByText("Today's iman")).toBeInTheDocument();
  expect(await findByText('Daily spark')).toBeInTheDocument();
});

test('the Iman quick action opens the tracker', async () => {
  const onNavigate = rs.fn<(page: string) => void>();
  const { findByText } = renderHome({ onNavigate });

  fireEvent.tap(await findByText('Iman'));

  expect(onNavigate).toHaveBeenCalledWith('iman');
});

test('the home redirect icon returns to the welcome screen', async () => {
  const onRedirect = rs.fn();
  const { findByText } = renderHome({ onRedirect });

  fireEvent.tap(await findByText('←'));

  expect(onRedirect).toHaveBeenCalled();
});

test('the profile sheet shows account details and settings tabs', async () => {
  const { findAllByText, findByText } = render(
    <ProfileSheet
      userName="Faleel"
      userEmail="faleel@example.com"
      onClose={() => {}}
      onUpdateAvatar={() => {}}
      onSignOut={() => {}}
      onDeleteAccount={() => {}}
    />,
  );

  expect(await findAllByText('Faleel')).not.toHaveLength(0);
  expect(await findAllByText('faleel@example.com')).not.toHaveLength(0);

  fireEvent.tap(await findByText('Settings'));

  expect(await findByText('Log out of this device')).toBeInTheDocument();
  expect(await findByText('Delete account')).toBeInTheDocument();
});

test('deleting an account requires the confirmation phrase', async () => {
  const onDeleteAccount = rs.fn();
  const { findByPlaceholderText, findByText } = render(
    <ProfileSheet
      userName="Faleel"
      userEmail="faleel@example.com"
      onClose={() => {}}
      onUpdateAvatar={() => {}}
      onSignOut={() => {}}
      onDeleteAccount={onDeleteAccount}
    />,
  );

  fireEvent.tap(await findByText('Settings'));
  fireEvent.tap(await findByText('Delete'));

  const confirmation = await findByPlaceholderText('delete my account');
  typeInto(confirmation, 'delete');
  fireEvent.tap(await findByText('Delete account'));

  expect(onDeleteAccount).not.toHaveBeenCalled();
  expect(
    await findByText('Type "delete my account" exactly to continue.'),
  ).toBeInTheDocument();

  typeInto(confirmation, 'delete my account');
  fireEvent.tap(await findByText('Delete account'));

  expect(onDeleteAccount).toHaveBeenCalledTimes(1);
});

test('the source fallback shows the URL and a copy action', async () => {
  const { findByText } = render(
    <SourceLinkSheet
      label="Sahih al-Bukhari 1"
      url="https://sunnah.com/bukhari:1"
      onClose={() => {}}
    />,
  );

  expect(await findByText('https://sunnah.com/bukhari:1')).toBeInTheDocument();
  expect(await findByText('Copy link')).toBeInTheDocument();
});
