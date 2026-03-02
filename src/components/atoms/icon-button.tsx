import { Image } from 'expo-image';
import { Pressable, ViewStyle } from 'react-native';

import { colors, spacing } from '@/quarks';

interface IconButtonProps {
  sfSymbol: string;
  size?: number;
  tint?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export function IconButton({
  sfSymbol,
  size = 22,
  tint = colors.accent,
  style,
  onPress,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          padding: spacing.sm,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Image
        source={`sf:${sfSymbol}`}
        style={{ width: size, height: size, tintColor: tint }}
      />
    </Pressable>
  );
}
