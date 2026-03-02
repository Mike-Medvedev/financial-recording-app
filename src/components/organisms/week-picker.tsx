import { ScrollView, Pressable, Text, View } from "react-native";
import { getWeekKey, formatWeekLabel } from "@/lib/week";
import { colors, spacing, typography } from "@/lib/theme";

interface WeekPickerProps {
  selectedWeekKey: string;
  onSelectWeek: (weekKey: string) => void;
}

const WEEKS_TO_SHOW = 12;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function WeekPicker({ selectedWeekKey, onSelectWeek }: WeekPickerProps) {
  const today = new Date();
  const todayWeekKey = getWeekKey(today);
  const startMonday = new Date(today);
  const day = startMonday.getDay();
  const diff = day === 0 ? 6 : day - 1;
  startMonday.setDate(startMonday.getDate() - diff - (WEEKS_TO_SHOW / 2) * 7);

  const weeks: string[] = [];
  for (let i = 0; i < WEEKS_TO_SHOW; i++) {
    const monday = new Date(
      startMonday.getTime() + i * 7 * MS_PER_DAY
    );
    weeks.push(getWeekKey(monday));
  }

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text
        style={{
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.medium,
          color: colors.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: spacing.sm,
        }}
      >
        Week
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.md }}
      >
        {weeks.map((weekKey) => {
          const isSelected = weekKey === selectedWeekKey;
          const isCurrent = weekKey === todayWeekKey;
          return (
            <Pressable
              key={weekKey}
              onPress={() => onSelectWeek(weekKey)}
              style={({ pressed }) => [
                {
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: 12,
                  backgroundColor: isSelected
                    ? colors.accent
                    : colors.surfaceElevated,
                  borderCurve: "continuous",
                  opacity: pressed ? 0.8 : 1,
                  borderWidth: isCurrent && !isSelected ? 1 : 0,
                  borderColor: colors.accentMuted,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: isSelected
                    ? typography.fontWeight.semibold
                    : typography.fontWeight.regular,
                  color: colors.text,
                }}
              >
                {formatWeekLabel(weekKey)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
