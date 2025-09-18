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
	View,
} from 'react-native';
// lib
import { colors } from '@/lib/colorsJS';

type CustomTouchableProps = {
	title?: string;
	onPress: () => void;
	children?: React.ReactNode;
	icon?: React.ReactNode;
	containerStyle?: StyleProp<ViewStyle>; // custom style for container
	textStyle?: StyleProp<TextStyle>; // custom style for text
} & TouchableOpacityProps; // dziedziczenie pozostałych propsów np. disabled

export default function CustomTouchable({
	title,
	onPress,
	icon,
	containerStyle,
	textStyle,
	children,
	...rest
}: CustomTouchableProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.container, containerStyle]}
			{...rest}
		>
			{children ? (
				children
			) : (
				<>
					{icon}
					<Text style={[styles.title, textStyle]}>{title}</Text>
				</>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.primary[300],
		paddingVertical: 8,
		paddingHorizontal: 32,
		borderRadius: 100,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 45,
	},
	title: {
		color: 'white',
		fontSize: 15,
		fontWeight: 'bold',
		textAlign: 'center',
		marginLeft: 2, // offset from icon if it is
	},
});
