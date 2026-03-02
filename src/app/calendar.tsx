import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { getWeekKey } from '@/lib/week';
import { colors, radius, spacing, typography } from '@/quarks';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayISO(): string {
  return toISODate(new Date());
}

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
}

function getCalendarGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  // Monday = 0, Sunday = 6
  const startDow = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();

  const cells: CalendarDay[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrevMonth - i);
    cells.push({ date: toISODate(d), day: daysInPrevMonth - i, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    cells.push({ date: toISODate(d), day, isCurrentMonth: true });
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      cells.push({ date: toISODate(d), day, isCurrentMonth: false });
    }
  }

  return cells;
}

export default function CalendarScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ selectedDate?: string }>();
  const today = todayISO();
  const highlighted = params.selectedDate ?? today;

  const initialDate = highlighted ? new Date(highlighted + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const grid = useMemo(() => getCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);
  const weeks = useMemo(() => {
    const rows: CalendarDay[][] = [];
    for (let i = 0; i < grid.length; i += 7) {
      rows.push(grid.slice(i, i + 7));
    }
    return rows;
  }, [grid]);

  const goToPrevMonth = useCallback(() => {
    setViewMonth((m: number) => {
      if (m === 0) {
        setViewYear((y: number) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth((m: number) => {
      if (m === 11) {
        setViewYear((y: number) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const handleDayPress = useCallback(
    (date: string) => {
      const weekKey = getWeekKey(new Date(date + 'T00:00:00'));
      router.navigate({
        pathname: '/',
        params: { pickedDate: date, pickedWeekKey: weekKey },
      });
    },
    [router]
  );

  const CELL_SIZE = 42;

  return (
    <View style={{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl }}>
      {/* Month header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: spacing.xl,
        }}
      >
        <Pressable
          onPress={goToPrevMonth}
          style={({ pressed }: { pressed: boolean }) => ({
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: pressed ? colors.surfaceSelected : colors.surface,
          })}
        >
          <Text style={{ color: colors.text, fontSize: 18 }}>‹</Text>
        </Pressable>

        <Text style={[typography.heading, { color: colors.text }]}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Text>

        <Pressable
          onPress={goToNextMonth}
          style={({ pressed }: { pressed: boolean }) => ({
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: pressed ? colors.surfaceSelected : colors.surface,
          })}
        >
          <Text style={{ color: colors.text, fontSize: 18 }}>›</Text>
        </Pressable>
      </View>

      {/* Day-of-week headers */}
      <View style={{ flexDirection: 'row', paddingBottom: spacing.sm }}>
        {DAY_HEADERS.map((label) => (
          <View
            key={label}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: spacing.xs,
            }}
          >
            <Text
              style={[
                typography.caption,
                { color: colors.textTertiary, fontWeight: '600' },
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week: CalendarDay[], wi: number) => (
        <View key={wi} style={{ flexDirection: 'row' }}>
          {week.map((cell: CalendarDay) => {
            const isSelected = cell.date === highlighted;
            const isTodayCell = cell.date === today;

            let bgColor = 'transparent';
            let textColor: string = cell.isCurrentMonth
              ? colors.text
              : colors.textTertiary;

            if (isSelected) {
              bgColor = colors.accent;
              textColor = '#ffffff';
            } else if (isTodayCell) {
              bgColor = colors.accentSoft;
              textColor = colors.accent;
            }

            return (
              <View
                key={cell.date}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 2 }}
              >
                <Pressable
                  onPress={() => handleDayPress(cell.date)}
                  style={({ pressed }: { pressed: boolean }) => ({
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: CELL_SIZE / 2,
                    alignItems: 'center' as const,
                    justifyContent: 'center' as const,
                    backgroundColor: pressed && !isSelected
                      ? colors.surfaceSelected
                      : bgColor,
                  })}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: isSelected || isTodayCell ? '600' : '400',
                      fontVariant: ['tabular-nums'],
                      color: textColor,
                    }}
                  >
                    {cell.day}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}

      {/* Today shortcut */}
      <View style={{ alignItems: 'center', paddingTop: spacing.xl }}>
        <Pressable
          onPress={() => handleDayPress(today)}
          style={({ pressed }: { pressed: boolean }) => ({
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.sm,
            borderRadius: radius.full,
            backgroundColor: pressed ? colors.surfaceSelected : colors.surface,
          })}
        >
          <Text style={[typography.body, { color: colors.accent, fontWeight: '600' }]}>
            Today
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
