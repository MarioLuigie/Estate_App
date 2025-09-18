// modules
import React from 'react';
import { Image, Text, View } from 'react-native';
// components
import AgentContact from '@/components/content/PropertySections/AgentContact';

interface PropertySummaryProps {
	name: string;
	address: string;
	price: number;
	imageUrl: string;
	agent: any;
}

export default function PropertySummary({
	name,
	address,
	price,
	imageUrl,
	agent,
}: PropertySummaryProps) {
	return (
		<View className="m-4 p-4 flex flex-col border border-zinc-200 bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden">
      <Text className='text-2xl font-bold text-black pb-3'>Summary</Text>
			<View className="flex-row">
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

			<AgentContact agent={agent} />
		</View>
	);
}
