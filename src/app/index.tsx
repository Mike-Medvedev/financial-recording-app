import { useState, useCallback, useEffect } from "react";
import {
  ScrollView,
  View,
  Modal,
  Pressable,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import { getWeekKey, getDaysInWeek } from "@/lib/week";
import {
  WeekPicker,
  ExpenseTable,
  DaySelector,
  DayTransactionList,
} from "@/components/organisms";
import { Keypad } from "@/components/molecules";
import {
  useCategories,
  useWeekTotals,
  useDayTransactions,
  useAddTransaction,
  useAddCategory,
} from "@/hooks/use-expense-queries";
import type { Category } from "@/lib/db/types";
import { colors, spacing, typography } from "@/lib/theme";

const today = new Date();
const initialWeekKey = getWeekKey(today);
const initialDate = today.toISOString().slice(0, 10);

export default function HomeScreen() {
  const [weekKey, setWeekKey] = useState(initialWeekKey);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [keypadVisible, setKeypadVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [keypadValue, setKeypadValue] = useState("");
  const [addCategoryVisible, setAddCategoryVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: totals = [], isLoading: totalsLoading } = useWeekTotals(weekKey);
  const { data: dayTransactions = [], isLoading: dayLoading } =
    useDayTransactions(weekKey, selectedDate);
  const addTransaction = useAddTransaction();
  const addCategory = useAddCategory();

  // Keep selectedDate inside the selected week (fixes wrong-week bug)
  useEffect(() => {
    const daysInWeek = getDaysInWeek(weekKey);
    const todayStr = new Date().toISOString().slice(0, 10);
    const isTodayInWeek = daysInWeek.includes(todayStr);
    const newDate = isTodayInWeek ? todayStr : daysInWeek[0];
    setSelectedDate((prev) => (daysInWeek.includes(prev) ? prev : newDate));
  }, [weekKey]);

  const openKeypad = useCallback((category: Category) => {
    setSelectedCategory(category);
    setKeypadValue("");
    setKeypadVisible(true);
  }, []);

  const closeKeypad = useCallback(() => {
    setKeypadVisible(false);
    setSelectedCategory(null);
    setKeypadValue("");
  }, []);

  const handleKeypadAdd = useCallback(() => {
    if (!selectedCategory) return;
    const amountCents = Math.round((parseFloat(keypadValue || "0") || 0) * 100);
    if (amountCents <= 0) return;
    // Close keypad immediately so user sees feedback; totals refresh via invalidation
    closeKeypad();
    addTransaction.mutate({
      date: selectedDate,
      categoryId: selectedCategory.id,
      amount: amountCents,
    });
  }, [selectedCategory, selectedDate, keypadValue, addTransaction, closeKeypad]);

  const handleAddCategory = useCallback(() => {
    const name = newCategoryName.trim();
    if (!name) return;
    addCategory.mutate(name, {
      onSuccess: () => {
        setNewCategoryName("");
        setAddCategoryVisible(false);
      },
    });
  }, [newCategoryName, addCategory]);

  return (
    <>
      <Stack.Screen options={{ title: "Expenses" }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: spacing.xxl,
          gap: spacing.lg,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <WeekPicker selectedWeekKey={weekKey} onSelectWeek={setWeekKey} />

        <ExpenseTable
          categories={categories}
          totals={totals}
          onCellPress={openKeypad}
          onAddCategory={() => setAddCategoryVisible(true)}
        />

        <View>
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
            Transactions by day
          </Text>
          <DaySelector
            weekKey={weekKey}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <DayTransactionList
            transactions={dayTransactions}
            isLoading={dayLoading}
          />
        </View>
      </ScrollView>

      <Modal
        visible={keypadVisible}
        animationType="slide"
        transparent
        onRequestClose={closeKeypad}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
          onPress={closeKeypad}
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: spacing.lg,
              paddingBottom: spacing.xxl + 24,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              {selectedCategory && (
                <Text
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.textSecondary,
                    marginBottom: spacing.sm,
                  }}
                >
                  Add to {selectedCategory.name} · {selectedDate}
                </Text>
              )}
              <Keypad
                value={keypadValue}
                onChange={setKeypadValue}
                onAdd={handleKeypadAdd}
                disabled={addTransaction.isPending}
              />
            </KeyboardAvoidingView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={addCategoryVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddCategoryVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: spacing.lg,
          }}
          onPress={() => setAddCategoryVisible(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: spacing.lg,
              borderCurve: "continuous",
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.text,
                marginBottom: spacing.md,
              }}
            >
              New category
            </Text>
            <TextInput
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="e.g. Gas, Food, Luxury"
              placeholderTextColor={colors.textTertiary}
              style={{
                backgroundColor: colors.surfaceElevated,
                borderRadius: 12,
                padding: spacing.md,
                fontSize: typography.fontSize.base,
                color: colors.text,
                marginBottom: spacing.md,
                borderCurve: "continuous",
              }}
              autoFocus
              autoCapitalize="words"
            />
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <Pressable
                onPress={() => setAddCategoryVisible(false)}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  borderRadius: 12,
                  backgroundColor: colors.surfaceElevated,
                  alignItems: "center",
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
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleAddCategory}
                disabled={!newCategoryName.trim() || addCategory.isPending}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    padding: spacing.md,
                    borderRadius: 12,
                    backgroundColor: colors.accent,
                    alignItems: "center",
                    borderCurve: "continuous",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.text,
                  }}
                >
                  Add
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
