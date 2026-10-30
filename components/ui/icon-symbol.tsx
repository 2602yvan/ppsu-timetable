// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Define our own icon name type instead of using expo-symbols' full type
type IconName =
  | 'house.fill'
  | 'paperplane.fill'
  | 'chevron.left.forwardslash.chevron.right'
  | 'chevron.right'
  | 'arrow.left'
  | 'folder'
  | 'list.bullet'
  | 'square.and.pencil'
  | 'book.fill'
  | 'book'
  | 'arrow.up.right'
  | 'calendar'
  | 'chart.bar.fill'
  | 'location';

type IconMapping = Partial<Record<IconName, ComponentProps<typeof MaterialIcons>['name']>>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'arrow.left': 'arrow-back',
  'folder': 'folder',
  'list.bullet': 'list',
  'square.and.pencil': 'edit',
  'book.fill': 'book',
  'book': 'book',
  'arrow.up.right': 'open-in-new',
  'calendar': 'calendar-today',
  'chart.bar.fill': 'bar-chart',
  'location': 'my-location',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const materialIconName = MAPPING[name] || 'help';
  return <MaterialIcons color={color} size={size} name={materialIconName} style={style} />;
}
