import icons from '@/lib/constants/icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

type NavigateBackProps = {
	path?: any;
	title?: string | string[];
	children?: React.ReactNode;
};

export default function NavigateBack({
	path,
	title,
	children,
}: NavigateBackProps) {

	return (
		<View className="flex-row items-center justify-between w-full">
			<TouchableOpacity
				onPress={path ? () => router.push({ pathname: path }) : () => router.back()}
				className="flex-row bg-primary-200 rounded-full size-11 items-center justify-center border-[2px] border-zinc-600"
			>
				<Image source={icons.backArrow} className="size-5" />
			</TouchableOpacity>
			{title && <Text className="text-xl font-rubik-bold">{title}</Text>}
			{children && <>{children}</>}
		</View>
	);
}
