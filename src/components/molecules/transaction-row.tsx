import { Pressable, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/quarks';

interface TransactionRowProps {
  categoryName: string;
  amountCents: number;
  onDelete?: () => void;
}

export function TransactionRow({
  categoryName,
  amountCents,
  onDelete,
}: TransactionRowProps) {
  const formatted = `$${(amountCents / 100).toFixed(2)}`;
  return (
    <Pressable
      onLongPress={onDelete}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        borderCurve: 'continuous',
        backgroundColor: colors.surface,
      }}
    >
      <View
        style={{
          backgroundColor: colors.surfaceElevated,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: radius.sm,
          borderCurve: 'continuous',
        }}
      >
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          {categoryName}
        </Text>
      </View>
      <Text selectable style={[typography.amount, { color: colors.text }]}>
        {formatted}
      </Text>
    </Pressable>
  );
}
