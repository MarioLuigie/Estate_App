// modules
import React from 'react';
import {
	StyleProp,
	ViewStyle,
	TouchableOpacity,
	StyleSheet,
	TouchableOpacityProps,
} from 'react-native';
// lib
import { colors } from '@/lib/tools/colorsJS';

type IconButtonProps = {
	onPress: () => void;
	icon: React.ReactNode;
	containerStyle?: StyleProp<ViewStyle>;
} & TouchableOpacityProps;

export default function IconButton({
	onPress,
	icon,
	containerStyle,
	...rest
}: IconButtonProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.container, containerStyle]}
			{...rest}
		>
			{icon}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.primary[300],
		borderRadius: 100,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 55,
		width: 55,
	},
});
