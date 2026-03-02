import { Pressable, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/quarks';

interface CategoryCellProps {
  name: string;
  totalCents: number;
  onPress: () => void;
}

export function CategoryCell({ name, totalCents, onPress }: CategoryCellProps) {
  const formatted = `$${(totalCents / 100).toFixed(2)}`;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.surfaceSelected : colors.surface,
        borderRadius: radius.md,
        borderCurve: 'continuous',
        padding: spacing.md,
        alignItems: 'center',
        gap: spacing.xs,
        minWidth: 80,
      })}
    >
      <Text style={[typography.label, { color: colors.textSecondary }]}>
        {name}
      </Text>
      <Text selectable style={[typography.amount, { color: colors.text }]}>
        {formatted}
      </Text>
    </Pressable>
  );
}

export function AddCategoryCell({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.surfaceSelected : colors.surface,
        borderRadius: radius.md,
        borderCurve: 'continuous',
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 56,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
      })}
    >
      <Text style={{ color: colors.textSecondary, fontSize: 24 }}>+</Text>
    </Pressable>
  );
}
