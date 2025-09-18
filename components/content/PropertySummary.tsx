// components/PropertySummaryCard.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';

interface PropertySummaryCardProps {
	name: string;
	address: string;
	price: number;
	imageUrl: string;
}

export default function PropertySummaryCard({
	name,
	address,
	price,
	imageUrl,
}: PropertySummaryCardProps) {
	return (
		<View
			className="flex-row bg-white dark:bg-black rounded-2xl shadow-md overflow-hidden m-2"
		>
			{/* Image */}
			<View className="w-32 h-32">
				<Image
					source={{ uri: imageUrl }}
					className="w-full h-full rounded-l-2xl"
					resizeMode="cover"
				/>
			</View>

			{/* Info */}
			<View className="flex-1 p-4 justify-between">
				<View>
					<Text className="text-lg font-semibold text-black dark:text-white">
						{name}
					</Text>
					<Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">
						{address}
					</Text>
				</View>
				<Text className="text-xl font-bold text-black dark:text-white mt-2">
					${price}/night
				</Text>
			</View>
		</View>
	);
}
