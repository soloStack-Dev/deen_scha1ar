import '@testing-library/jest-dom';
import { fireEvent, render } from '@lynx-js/react/testing-library';
import { expect, test } from '@rstest/core';

import { App } from '../App.js';
import { SourceLinkSheet } from '../components/SourceLinkSheet.js';

test('home renders the iman hero and daily spark', async () => {
  const { findByText } = render(<App />);
  fireEvent.tap(await findByText('Go to page'));

  expect(await findByText("Today's iman")).toBeInTheDocument();
  expect(await findByText('Daily spark')).toBeInTheDocument();
});

test('the Iman quick action opens the tracker', async () => {
  const { findAllByText, findByText } = render(<App />);
  fireEvent.tap(await findByText('Go to page'));
  const imanButtons = await findAllByText('Iman');
  fireEvent.tap(imanButtons[0]);

  expect(await findByText('Iman Tracker')).toBeInTheDocument();
  expect(await findByText("Today's prayers")).toBeInTheDocument();
});

test('the welcome go-to-page action opens the home page as Faleel', async () => {
  const { findByText } = render(<App />);
  expect(await findByText('Deensch1ar')).toBeInTheDocument();
  fireEvent.tap(await findByText('Go to page'));

  expect(await findByText('Faleel')).toBeInTheDocument();
  expect(await findByText("Today's iman")).toBeInTheDocument();
});

test('the home redirect icon returns to the welcome screen', async () => {
  const { findByText } = render(<App />);
  fireEvent.tap(await findByText('Go to page'));
  fireEvent.tap(await findByText('←'));

  expect(await findByText('Deensch1ar')).toBeInTheDocument();
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
