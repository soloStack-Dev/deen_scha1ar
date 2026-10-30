import { useState } from '@lynx-js/react';

import './Home.css';

import { DailySparkRow } from '../../components/DailySparkRow.js';
import { Header } from '../../components/Header.js';
import { ImanHeroCard } from '../../components/ImanHeroCard.js';
import { QuickActions } from '../../components/QuickActions.js';
import { RoutineList } from '../../components/RoutineList.js';
import { WeekChart } from '../../components/WeekChart.js';
import { getAyah, getThought } from '../../data/content.js';
import { dayNumberForDate, toDateKey } from '../../lib/date.js';
import { createId } from '../../lib/id.js';
import { getNextPrayer } from '../../lib/prayerTimes.js';
import { useNow } from '../../lib/useNow.js';
import { useApp } from '../../state/AppProvider.js';
import { PRAYER_NAMES } from '../../state/constants.js';
import {
  completedCount,
  currentStreak,
  weekData,
} from '../../state/selectors.js';
import type { Page } from '../../state/types.js';

interface HomeProps {
  onNavigate: (page: Page) => void;
  onMore: () => void;
  onRedirect: () => void;
}

export function Home({ onNavigate, onMore, onRedirect }: HomeProps) {
  const { state, dispatch } = useApp();
  const now = useNow();
  const today = toDateKey(now);
  const [selectedDate, setSelectedDate] = useState(today);
  const active = state.tracker.active;
  const dayNumber = dayNumberForDate(state.settings.installDate, today);
  const ayah = getAyah(dayNumber);
  const thought = getThought(dayNumber);
  const nextPrayer = getNextPrayer(state.settings, now);
  const statuses = PRAYER_NAMES.map((name) => active.prayers[name]);
  const week = weekData(state, today);
  const routineDone = state.routine.filter((item) => item.done).length;
  const selectedWeekDate = week.some((day) => day.date === selectedDate)
    ? selectedDate
    : today;

  return (
    <view className="page">
      <Header onNotifications={onMore} onRedirect={onRedirect} />

      <ImanHeroCard
        completed={completedCount(active)}
        total={PRAYER_NAMES.length}
        statuses={statuses}
        nextPrayerLabel={nextPrayer.label}
        streak={currentStreak(state, today)}
        onOpen={() => onNavigate('iman')}
      />

      <QuickActions onNavigate={onNavigate} onMore={onMore} />

      <view className="section-head">
        <text className="section-title">Daily spark</text>
        <view bindtap={() => onNavigate('iman')}>
          <text className="section-link">Open</text>
        </view>
      </view>

      <DailySparkRow
        ayah={ayah}
        thought={thought}
        onOpenAyah={() => onNavigate('iman')}
        onOpenThought={() => onNavigate('iman')}
      />

      <view className="section-head">
        <text className="section-title">Today&apos;s routine</text>
        <text className="section-caption">
          {routineDone}/{state.routine.length} done
        </text>
      </view>
      <RoutineList
        items={state.routine}
        onToggle={(id) => dispatch({ type: 'TOGGLE_ROUTINE', id })}
        onAdd={(label) =>
          dispatch({
            type: 'ADD_ROUTINE',
            item: {
              id: createId('routine'),
              label,
              done: false,
              createdAt: Date.now(),
            },
          })
        }
        onDelete={(id) => dispatch({ type: 'DELETE_ROUTINE', id })}
      />

      <view className="section-head">
        <text className="section-title">This week</text>
        <text className="section-caption">Mon - Sun</text>
      </view>
      <WeekChart
        data={week}
        selectedDate={selectedWeekDate}
        onSelect={setSelectedDate}
      />

      <view className="home-note">
        <text className="home-note__title">Free and legal by design</text>
        <text className="home-note__text">
          Qur&apos;an, hadith references and books link to their source. Nothing
          is scraped or republished without a licence.
        </text>
      </view>
    </view>
  );
}
