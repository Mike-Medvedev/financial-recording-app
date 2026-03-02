import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { DaySelector } from '@/components/organisms/day-selector';
import { DayTransactionList } from '@/components/organisms/day-transaction-list';
import { ExpenseTable } from '@/components/organisms/expense-table';
import { WeekPicker } from '@/components/organisms/week-picker';
import type { Category } from '@/lib/db';
import { getDaysInWeek, getWeekKey } from '@/lib/week';
import { colors, spacing, typography } from '@/quarks';

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const today = todayISO();
  const [weekKey, setWeekKey] = useState(() => getWeekKey());
  const [selectedDate, setSelectedDate] = useState(today);

  const handleCellPress = useCallback(
    (category: Category) => {
      router.push({
        pathname: '/keypad',
        params: {
          categoryId: String(category.id),
          categoryName: category.name,
          date: selectedDate,
        },
      });
    },
    [router, selectedDate]
  );

  const handleAddCategory = useCallback(() => {
    router.push('/add-category');
  }, [router]);

  const handleWeekChange = useCallback(
    (newWeekKey: string) => {
      setWeekKey(newWeekKey);
      const days = getDaysInWeek(newWeekKey);
      if (!days.includes(selectedDate)) {
        setSelectedDate(days.includes(today) ? today : days[0]);
      }
    },
    [selectedDate, today]
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      <WeekPicker weekKey={weekKey} onWeekChange={handleWeekChange} />

      <View style={{ paddingVertical: spacing.md }}>
        <ExpenseTable
          weekKey={weekKey}
          onCellPress={handleCellPress}
          onAddCategory={handleAddCategory}
        />
      </View>

      <DaySelector
        weekKey={weekKey}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      <View style={{ paddingTop: spacing.md }}>
        <Text
          style={[
            typography.label,
            {
              color: colors.textSecondary,
              paddingHorizontal: spacing.lg,
              paddingBottom: spacing.sm,
            },
          ]}
        >
          Transactions
        </Text>
        <DayTransactionList date={selectedDate} />
      </View>
    </ScrollView>
  );
}
