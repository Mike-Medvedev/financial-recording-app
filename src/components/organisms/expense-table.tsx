import { ScrollView, View, Text, Pressable } from "react-native";
import { CategoryCell } from "@/components/molecules";
import type { Category, CategoryTotal } from "@/lib/db/types";
import { colors, radii, spacing, typography } from "@/lib/theme";

interface ExpenseTableProps {
  categories: Category[];
  totals: CategoryTotal[];
  onCellPress: (category: Category) => void;
  onAddCategory?: () => void;
}

export function ExpenseTable({
  categories,
  totals,
  onCellPress,
  onAddCategory,
}: ExpenseTableProps) {
  const totalByCategoryId = new Map(totals.map((t) => [t.category_id, t.total]));

  return (
    <View style={{ marginBottom: spacing.lg }}>
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
        Running totals
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.md }}
      >
        {categories.map((cat) => (
          <CategoryCell
            key={cat.id}
            label={cat.name}
            totalCents={totalByCategoryId.get(cat.id) ?? 0}
            onPress={() => onCellPress(cat)}
          />
        ))}
        {onAddCategory && (
          <Pressable
            onPress={onAddCategory}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surfaceElevated,
                borderRadius: radii.md,
                padding: spacing.md,
                minWidth: 100,
                justifyContent: "center",
                alignItems: "center",
                borderCurve: "continuous",
                opacity: pressed ? 0.8 : 1,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.medium,
                color: colors.textSecondary,
              }}
            >
              +
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
