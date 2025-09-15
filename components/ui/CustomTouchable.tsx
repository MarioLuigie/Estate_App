// modules
import React from 'react';
import {
  StyleProp,
  TextStyle,
  ViewStyle,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
// lib
import { colors } from '@/lib/colorsJS';

type CustomTouchableProps = {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>; // custom style for container
  textStyle?: StyleProp<TextStyle>;      // custom style for text
} & TouchableOpacityProps; // dziedziczenie pozostałych propsów np. disabled

export default function CustomTouchable({
  title,
  onPress,
  icon,
  containerStyle,
  textStyle,
  ...rest
}: CustomTouchableProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}
      {...rest}
    >
      {icon && <>{icon}</>}
      <Text style={[styles.title, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[100],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 6, // offset from icon if it is
  },
});
