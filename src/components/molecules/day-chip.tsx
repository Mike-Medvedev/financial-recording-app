import { Pressable, Text } from "react-native";
import { colors, radii, spacing, typography } from "@/lib/theme";

interface DayChipProps {
  label: string;
  date: string;
  selected: boolean;
  onPress: () => void;
}

export function DayChip({ label, date, selected, onPress }: DayChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radii.full,
          backgroundColor: selected ? colors.accent : colors.surfaceElevated,
          borderCurve: "continuous",
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={{
          fontSize: typography.fontSize.sm,
          fontWeight: selected
            ? typography.fontWeight.semibold
            : typography.fontWeight.regular,
          color: colors.text,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
