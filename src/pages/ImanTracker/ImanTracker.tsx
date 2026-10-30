import { useState } from '@lynx-js/react';

import './ImanTracker.css';

import { AyahCard } from '../../components/AyahCard.js';
import { ConfirmSheet } from '../../components/ConfirmSheet.js';
import { DaySelector } from '../../components/DaySelector.js';
import { PrayerBox } from '../../components/PrayerBox.js';
import { ThoughtCard } from '../../components/ThoughtCard.js';
import { WeekChart } from '../../components/WeekChart.js';
import { getAyah, getHadith, getThought } from '../../data/content.js';
import { dayNumberForDate, formatLongDate, toDateKey } from '../../lib/date.js';
import { useNow } from '../../lib/useNow.js';
import { useApp } from '../../state/AppProvider.js';
import { PRAYER_LABELS, PRAYER_NAMES } from '../../state/constants.js';
import {
  completedCount,
  currentStreak,
  progressPercent,
  weekData,
} from '../../state/selectors.js';

interface ImanTrackerProps {
  onToast: (message: string) => void;
  onOpenLink: (url: string, label: string) => void;
}

export function ImanTracker({ onToast, onOpenLink }: ImanTrackerProps) {
  const { state, dispatch } = useApp();
  const now = useNow();
  const today = toDateKey(now);
  const active = state.tracker.active;
  const dayNumber = dayNumberForDate(state.settings.installDate, today);
  const [day, setDay] = useState(dayNumber);
  const [selectedDate, setSelectedDate] = useState(today);
  const [askFinish, setAskFinish] = useState(false);

  const completed = completedCount(active);
  const percent = progressPercent(active);
  const streak = currentStreak(state, today);
  const week = weekData(state, today);
  const ayah = getAyah(day);
  const thought = getThought(day);
  const hadith = getHadith(day);
  const pendingCount = PRAYER_NAMES.filter(
    (name) => active.prayers[name] === 'pending',
  ).length;

  function openHadith() {
    onOpenLink(hadith.sourceUrl, `Sahih al-Bukhari ${hadith.number}`);
  }

  return (
    <view className="page">
      <view className="page-head page-head--row">
        <view className="page-head__copy">
          <text className="page-title">Iman Tracker</text>
          <text className="page-subtitle">{formatLongDate(now)}</text>
        </view>
        <view className="page-head__action" bindtap={() => setAskFinish(true)}>
          <text className="page-head__action-text">Finish day</text>
        </view>
      </view>

      <view className="tracker-summary">
        <view className="tracker-summary__top">
          <text className="tracker-summary__eyebrow">Active day</text>
          <text className="tracker-summary__streak">{streak} day streak</text>
        </view>
        <view className="tracker-summary__count-row">
          <text className="tracker-summary__count">{completed}</text>
          <text className="tracker-summary__total"> / {PRAYER_NAMES.length} prayers</text>
        </view>
        <view className="tracker-summary__bar">
          <view
            className="tracker-summary__fill"
            style={{ width: `${percent}%` }}
          />
        </view>
      </view>

      <view className="section-head">
        <text className="section-title">Today&apos;s prayers</text>
        <text className="section-caption">Tap to change</text>
      </view>

      <view className="prayer-grid">
        {PRAYER_NAMES.map((name) => (
          <PrayerBox
            key={name}
            name={name}
            status={active.prayers[name]}
            onChange={() => dispatch({ type: 'CYCLE_PRAYER', prayer: name })}
          />
        ))}
      </view>

      <view className="reading-grid">
        <view
          className={`reading-card ${active.quranDone ? 'reading-card--done' : ''}`}
          bindtap={() => dispatch({ type: 'TOGGLE_READING', key: 'quranDone' })}
        >
          <text className="reading-card__eyebrow">Qur&apos;an</text>
          <text className="reading-card__title">Read 10 minutes</text>
          <text className="reading-card__state">
            {active.quranDone ? '✓ Done' : 'Not yet'}
          </text>
        </view>
        <view
          className={`reading-card ${active.bukhariDone ? 'reading-card--done' : ''}`}
          bindtap={() => dispatch({ type: 'TOGGLE_READING', key: 'bukhariDone' })}
        >
          <text className="reading-card__eyebrow">Bukhari</text>
          <text className="reading-card__title">Read 10 minutes</text>
          <text className="reading-card__state">
            {active.bukhariDone ? '✓ Done' : 'Not yet'}
          </text>
        </view>
      </view>

      <view className="section-head">
        <text className="section-title">Last 7 days</text>
        <text className="section-caption">{PRAYER_LABELS.fajr} to Isha</text>
      </view>
      <WeekChart data={week} selectedDate={selectedDate} onSelect={setSelectedDate} />

      <view className="section-head">
        <text className="section-title">Qur&apos;an for today</text>
        <text className="section-caption">Day {day} of 7</text>
      </view>
      <DaySelector value={day} onChange={setDay} />
      <AyahCard ayah={ayah} />

      <view className="section-head">
        <text className="section-title">Thought for today</text>
        <text className="section-caption">Day {day} of 7</text>
      </view>
      <ThoughtCard thought={thought} />

      <view className="hadith-card">
        <text className="hadith-card__eyebrow">Hadith · Day {day} of 7</text>
        <text className="hadith-card__title">Sahih al-Bukhari {hadith.number}</text>
        <text className="hadith-card__topic">{hadith.topic}</text>
        <text className="hadith-card__note">{hadith.note}</text>
        <view className="button button--dark hadith-card__button" bindtap={openHadith}>
          <text className="button__label button__label--light">
            Open on Sunnah.com
          </text>
        </view>
      </view>

      <view className="danger-zone">
        <text className="danger-zone__title">Finish day</text>
        <text className="danger-zone__text">
          Archive today&apos;s log and start a fresh day. Past days stay in
          history.
        </text>
        <view className="button button--danger" bindtap={() => setAskFinish(true)}>
          <text className="button__label button__label--light">Finish day</text>
        </view>
      </view>

      {askFinish ? (
        <ConfirmSheet
          title="Finish this day?"
          message={
            pendingCount > 0
              ? `${pendingCount} ${pendingCount === 1 ? 'prayer is' : 'prayers are'} not marked. Finish anyway? The current log is archived and a fresh day starts.`
              : 'The current log is archived and a fresh day starts with every prayer pending.'
          }
          confirmLabel="Finish day"
          danger
          onConfirm={() => {
            dispatch({ type: 'FINISH_DAY', today });
            setAskFinish(false);
            setSelectedDate(today);
            onToast('New day started.');
          }}
          onCancel={() => setAskFinish(false)}
        />
      ) : null}
    </view>
  );
}
