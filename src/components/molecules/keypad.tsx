import { Pressable, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/quarks';

interface KeypadProps {
  value: string;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
];

export function Keypad({
  onDigit,
  onBackspace,
  onSubmit,
  submitLabel = 'Add',
  submitDisabled = false,
}: KeypadProps) {
  return (
    <View style={{ gap: spacing.sm }}>
      {KEYS.map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: spacing.sm }}>
          {row.map((key) => (
            <Pressable
              key={key}
              onPress={() => {
                if (key === '⌫') onBackspace();
                else onDigit(key);
              }}
              style={({ pressed }) => ({
                flex: 1,
                height: 52,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.md,
                borderCurve: 'continuous',
                backgroundColor: pressed
                  ? colors.surfaceSelected
                  : colors.surfaceElevated,
              })}
            >
              <Text style={[typography.keypadDigit, { color: colors.text }]}>
                {key}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
      <Pressable
        onPress={onSubmit}
        disabled={submitDisabled}
        style={({ pressed }) => ({
          height: 52,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.md,
          borderCurve: 'continuous',
          backgroundColor: submitDisabled
            ? colors.surfaceElevated
            : pressed
              ? '#3a8adf'
              : colors.accent,
          opacity: submitDisabled ? 0.5 : 1,
        })}
      >
        <Text
          style={[
            typography.body,
            {
              fontWeight: '600',
              color: submitDisabled ? colors.textSecondary : '#ffffff',
            },
          ]}
        >
          {submitLabel}
        </Text>
      </Pressable>
    </View>
  );
}
