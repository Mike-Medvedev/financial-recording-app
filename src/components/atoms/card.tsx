import { View, ViewProps } from 'react-native';

import { colors, radius, spacing } from '@/quarks';

interface CardProps extends ViewProps {
  elevated?: boolean;
}

export function Card({ style, elevated, ...props }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
          borderRadius: radius.lg,
          borderCurve: 'continuous',
          padding: spacing.lg,
        },
        style,
      ]}
      {...props}
    />
  );
}
