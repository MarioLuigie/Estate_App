import React from 'react';
import { Image, Text, View } from 'react-native';

import images from '@/lib/constants/images';

export default function NoResults() {
	return (
		<View className="flex items-center">
			<Image
				source={images.noResult}
				className="w-11/12 h-80"
				resizeMode="contain"
			/>
			<Text className="text-2xl font-rubik-bold text-black-300 mt-5">
				No Result
			</Text>
			<Text className="text-base text-black-100 mt-2">
				We could not find any result
			</Text>
		</View>
	);
}
