import { View, Text } from "react-native";
import { AmountText } from "@/components/atoms";
import { colors, spacing, typography } from "@/lib/theme";

interface TransactionRowProps {
  categoryName: string;
  amountCents: number;
}

export function TransactionRow({ categoryName, amountCents }: TransactionRowProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surfaceElevated,
        borderRadius: 8,
        marginBottom: spacing.xs,
        borderCurve: "continuous",
      }}
    >
      <Text
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          color: colors.text,
        }}
      >
        {categoryName}
      </Text>
      <AmountText value={amountCents} />
    </View>
  );
}
