import { Text, TextProps } from 'react-native';

import { colors, typography } from '@/quarks';

interface AmountTextProps extends TextProps {
  cents: number;
  size?: 'normal' | 'large';
}

export function AmountText({ cents, size = 'normal', style, ...props }: AmountTextProps) {
  const formatted = `$${(cents / 100).toFixed(2)}`;
  return (
    <Text
      selectable
      style={[
        size === 'large' ? typography.amountLarge : typography.amount,
        { color: colors.text },
        style,
      ]}
      {...props}
    >
      {formatted}
    </Text>
  );
}
