import { Text, type TextProps } from "react-native";
import { colors, typography } from "@/lib/theme";

export function AmountText({
  value,
  ...props
}: TextProps & { value: number }) {
  const formatted = (value / 100).toFixed(2);
  return (
    <Text
      selectable
      style={[
        {
          fontVariant: ["tabular-nums"],
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text,
        },
        props.style,
      ]}
      {...props}
    >
      ${formatted}
    </Text>
  );
}
