import { Pressable, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/quarks';
import { formatWeekLabel, shiftWeek } from '@/lib/week';

interface WeekPickerProps {
  weekKey: string;
  onWeekChange: (weekKey: string) => void;
}

export function WeekPicker({ weekKey, onWeekChange }: WeekPickerProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
      }}
    >
      <Pressable
        onPress={() => onWeekChange(shiftWeek(weekKey, -1))}
        style={({ pressed }) => ({
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? colors.surfaceSelected : colors.surface,
        })}
      >
        <Text style={{ color: colors.text, fontSize: 18 }}>‹</Text>
      </Pressable>

      <Text selectable style={[typography.heading, { color: colors.text }]}>
        {formatWeekLabel(weekKey)}
      </Text>

      <Pressable
        onPress={() => onWeekChange(shiftWeek(weekKey, 1))}
        style={({ pressed }) => ({
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? colors.surfaceSelected : colors.surface,
        })}
      >
        <Text style={{ color: colors.text, fontSize: 18 }}>›</Text>
      </Pressable>
    </View>
  );
}
