import { View, type ViewProps } from "react-native";
import { colors, radii, spacing } from "@/lib/theme";

export function Card({ style, ...props }: ViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          padding: spacing.md,
          borderCurve: "continuous",
        },
        style,
      ]}
      {...props}
    />
  );
}
