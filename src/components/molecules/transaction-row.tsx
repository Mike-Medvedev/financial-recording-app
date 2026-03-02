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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: radius.md,
        borderCurve: 'continuous',
        backgroundColor: colors.surface,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
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
      </View>

      {onDelete && (
        <Pressable
          onPress={onDelete}
          hitSlop={4}
          style={({ pressed }) => ({
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            alignSelf: 'stretch',
            backgroundColor: pressed
              ? colors.destructive
              : 'rgba(255, 69, 58, 0.15)',
          })}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: colors.destructive,
            }}
          >
            ✕
          </Text>
        </Pressable>
      )}
    </View>
  );
}
