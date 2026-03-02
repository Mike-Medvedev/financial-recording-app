import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useAddCategory } from '@/hooks/use-add-category';
import { colors, radius, spacing, typography } from '@/quarks';

export default function AddCategoryScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const addCategory = useAddCategory();

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) return;

    addCategory.mutate(trimmed, {
      onSuccess: () => router.back(),
    });
  }, [name, addCategory, router]);

  return (
    <View
      style={{
        flex: 1,
        padding: spacing.xl,
        gap: spacing.lg,
        backgroundColor: colors.surface,
      }}
    >
      <Text style={[typography.heading, { color: colors.text }]}>
        New Category
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Category name"
        placeholderTextColor={colors.textTertiary}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        style={{
          ...typography.body,
          color: colors.text,
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius.md,
          borderCurve: 'continuous',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        }}
      />

      <Pressable
        onPress={handleSubmit}
        disabled={!name.trim() || addCategory.isPending}
        style={({ pressed }) => ({
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.md,
          borderCurve: 'continuous',
          backgroundColor:
            !name.trim() || addCategory.isPending
              ? colors.surfaceElevated
              : pressed
                ? '#3a8adf'
                : colors.accent,
          opacity: !name.trim() ? 0.5 : 1,
        })}
      >
        <Text
          style={[
            typography.body,
            {
              fontWeight: '600',
              color:
                !name.trim() || addCategory.isPending
                  ? colors.textSecondary
                  : '#ffffff',
            },
          ]}
        >
          {addCategory.isPending ? 'Adding...' : 'Add Category'}
        </Text>
      </Pressable>
    </View>
  );
}
