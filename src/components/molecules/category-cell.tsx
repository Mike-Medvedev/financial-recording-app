import { Pressable, Text, View } from "react-native";
import { AmountText } from "@/components/atoms";
import { colors, radii, spacing, typography } from "@/lib/theme";

interface CategoryCellProps {
  label: string;
  totalCents: number;
  onPress: () => void;
}

export function CategoryCell({ label, totalCents, onPress }: CategoryCellProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: colors.surfaceElevated,
          borderRadius: radii.md,
          padding: spacing.md,
          minWidth: 100,
          borderCurve: "continuous",
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={{
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.medium,
          color: colors.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: spacing.xs,
        }}
      >
        {label}
      </Text>
      <AmountText value={totalCents} />
    </Pressable>
  );
}
