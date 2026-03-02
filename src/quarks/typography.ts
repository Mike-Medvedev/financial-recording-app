import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'system-ui',
  default: 'normal',
});

export const typography = {
  title: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  } satisfies TextStyle,

  heading: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  } satisfies TextStyle,

  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
  } satisfies TextStyle,

  label: {
    fontFamily,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  } satisfies TextStyle,

  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
  } satisfies TextStyle,

  amount: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  } satisfies TextStyle,

  amountLarge: {
    fontFamily,
    fontSize: 36,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  } satisfies TextStyle,

  keypadDigit: {
    fontFamily,
    fontSize: 24,
    fontWeight: '400',
  } satisfies TextStyle,
} as const;
