import { Pressable, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "@/lib/theme";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

interface KeypadProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  disabled?: boolean;
}

function formatDisplay(val: string): string {
  if (!val) return "0.00";
  const num = parseFloat(val) || 0;
  return num.toFixed(2);
}

export function Keypad({ value, onChange, onAdd, disabled }: KeypadProps) {
  const handlePress = (key: string) => {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === ".") {
      if (value.includes(".")) return;
      onChange(value ? `${value}.` : "0.");
      return;
    }
    if (value === "0" && key !== ".") {
      onChange(key);
      return;
    }
    const next = value + key;
    const parts = next.split(".");
    if (parts[1]?.length > 2) return;
    onChange(next);
  };

  const amountCents = Math.round((parseFloat(value || "0") || 0) * 100);

  return (
    <View style={{ gap: spacing.md }}>
      <View
        style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: radii.md,
          padding: spacing.lg,
          alignItems: "center",
          borderCurve: "continuous",
        }}
      >
        <Text
          selectable
          style={{
            fontVariant: ["tabular-nums"],
            fontSize: typography.fontSize.xxl,
            fontWeight: typography.fontWeight.bold,
            color: colors.text,
          }}
        >
          ${formatDisplay(value)}
        </Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        {DIGITS.map((key) => (
          <Pressable
            key={key}
            onPress={() => handlePress(key)}
            disabled={disabled}
            style={({ pressed }) => [
              {
                width: "31%",
                aspectRatio: 1.2,
                backgroundColor: colors.surface,
                borderRadius: radii.md,
                justifyContent: "center",
                alignItems: "center",
                borderCurve: "continuous",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.medium,
                color: colors.text,
              }}
            >
              {key}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={onAdd}
        disabled={disabled || amountCents <= 0}
        style={({ pressed }) => [
          {
            backgroundColor: amountCents > 0 ? colors.accent : colors.border,
            borderRadius: radii.md,
            padding: spacing.md,
            alignItems: "center",
            borderCurve: "continuous",
            opacity: pressed && amountCents > 0 ? 0.8 : 1,
          },
        ]}
      >
        <Text
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text,
          }}
        >
          Add
        </Text>
      </Pressable>
    </View>
  );
}
