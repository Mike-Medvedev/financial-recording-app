import { ScrollView, View } from 'react-native';

import {
  CategoryCell,
  AddCategoryCell,
} from '@/components/molecules/category-cell';
import { useCategories } from '@/hooks/use-categories';
import { useWeekTotals } from '@/hooks/use-week-totals';
import type { Category, CategoryTotal } from '@/lib/db';
import { spacing } from '@/quarks';

interface ExpenseTableProps {
  weekKey: string;
  onCellPress: (category: Category) => void;
  onAddCategory: () => void;
}

export function ExpenseTable({
  weekKey,
  onCellPress,
  onAddCategory,
}: ExpenseTableProps) {
  const { data: categories = [] } = useCategories();
  const { data: totals = [] } = useWeekTotals(weekKey);

  const totalsMap = new Map<number, number>();
  totals.forEach((t: CategoryTotal) => totalsMap.set(t.category_id, t.total));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
      }}
    >
      {categories.map((cat: Category) => (
        <CategoryCell
          key={cat.id}
          name={cat.name}
          totalCents={totalsMap.get(cat.id) ?? 0}
          onPress={() => onCellPress(cat)}
        />
      ))}
      <AddCategoryCell onPress={onAddCategory} />
    </ScrollView>
  );
}
