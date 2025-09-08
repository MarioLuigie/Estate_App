import icons from '@/lib/constants/icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

type NavigateBackProps = {
	path: any;
	title: string | string[];
};

export default function NavigateBack({ path, title }: NavigateBackProps) {
	return (
		<View className="flex-row items-center justify-between w-full">
			<TouchableOpacity
				onPress={() => router.push({ pathname: path })}
				className="flex-row bg-primary-200 rounded-full size-11 items-center justify-center border-[2px] border-zinc-600"
			>
				<Image source={icons.backArrow} className="size-5" />
			</TouchableOpacity>
			<Text className="text-xl font-rubik-bold">{title}</Text>
		</View>
	);
}
