import { Pressable, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/quarks';
import { formatDayShort, formatDayNumber, isToday } from '@/lib/week';

interface DayChipProps {
  date: string;
  selected: boolean;
  onPress: () => void;
}

export function DayChip({ date, selected, onPress }: DayChipProps) {
  const today = isToday(date);
  return (
    <Pressable
      onPress={onPress}
      style={{
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
        borderCurve: 'continuous',
        backgroundColor: selected ? colors.accent : 'transparent',
      }}
    >
      <Text
        style={[
          typography.caption,
          {
            color: selected
              ? '#ffffff'
              : today
                ? colors.accent
                : colors.textSecondary,
          },
        ]}
      >
        {formatDayShort(date)}
      </Text>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: today && !selected ? colors.accentSoft : 'transparent',
        }}
      >
        <Text
          style={[
            typography.body,
            {
              fontWeight: selected || today ? '600' : '400',
              color: selected ? '#ffffff' : today ? colors.accent : colors.text,
            },
          ]}
        >
          {formatDayNumber(date)}
        </Text>
      </View>
    </Pressable>
  );
}
