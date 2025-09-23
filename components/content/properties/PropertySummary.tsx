// modules
import React from 'react';
import { Image, Text, View } from 'react-native';
// components
import AgentContact from '@/components/content/AgentContact';
import Paper from '@/components/ui/Paper';

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
		<Paper>
			<Text className="text-black-300 text-xl font-rubik-bold pb-3">
				Summary
			</Text>
			<View className="flex-row">
				{/* Image */}
				<View style={{ width: 100, height: 100 }}>
					<Image
						source={{ uri: imageUrl }}
						className="w-full h-full rounded-l-2xl"
						resizeMode="cover"
					/>
				</View>

				{/* Info */}
				<View className="flex-1 px-4 justify-between">
					<View>
						<Text className="text-lg font-semibold text-black dark:text-white">
							{name}
						</Text>
						<Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">
							{address}
						</Text>
					</View>
					<Text className="text-xl font-bold text-primary-300 dark:text-white mt-2 text-right w-full">
						${price}/night
					</Text>
				</View>
			</View>

			<AgentContact agent={agent} isTitle={false} />
		</Paper>
	);
}
