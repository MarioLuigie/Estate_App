// modules
import React from 'react';
import { View, Text } from 'react-native';

type OverviewProps = {
	property: any;
};

export default function Overview({ property }: OverviewProps) {
	return (
		<View className="mt-7">
			<Text className="text-black-300 text-xl font-rubik-bold">
				Overview
			</Text>
			<Text className="text-black-200 text-base font-rubik mt-2">
				{property?.description}
			</Text>
		</View>
	);
}
