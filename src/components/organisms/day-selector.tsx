import { View } from 'react-native';

import { DayChip } from '@/components/molecules/day-chip';
import { getDaysInWeek } from '@/lib/week';
import { spacing } from '@/quarks';

interface DaySelectorProps {
  weekKey: string;
  selectedDate: string;
  onSelect: (date: string) => void;
}

export function DaySelector({
  weekKey,
  selectedDate,
  onSelect,
}: DaySelectorProps) {
  const days = getDaysInWeek(weekKey);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
      }}
    >
      {days.map((date) => (
        <DayChip
          key={date}
          date={date}
          selected={date === selectedDate}
          onPress={() => onSelect(date)}
        />
      ))}
    </View>
  );
}
