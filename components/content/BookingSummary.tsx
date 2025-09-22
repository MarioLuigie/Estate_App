// modules
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
// components
import Paper from '@/components/ui/Paper';
import { formatDate } from '@/lib/tools';
import AgentContact from './PropertySections/AgentContact';
import { router } from 'expo-router';
import { ROUTES } from '@/lib/constants/paths';

interface BookingSummaryProps {
	booking: {
		startDate: string;
		endDate: string;
		status: string;
		totalPrice: number;
		createdAt: string;
	};
	property: any;
}

export default function BookingSummary({
	booking,
	property,
}: BookingSummaryProps) {
	return (
		<Paper>
			<Text className="text-black-300 text-xl font-rubik-bold pb-3">
				{property?.name}
			</Text>

			<View className="flex flex-row items-start justify-between">
				<View className="space-y-2">
					{/* Dates */}
					<View className="flex-row">
						<Text className="font-semibold text-black dark:text-white w-24">
							Visit:
						</Text>
						<Text className="text-gray-700 dark:text-gray-300">
							{formatDate(booking.startDate)} -{' '}
							{formatDate(booking.endDate)}
						</Text>
					</View>

					{/* Status */}
					<View className="flex-row">
						<Text className="font-semibold text-black dark:text-white w-24">
							Status:
						</Text>
						<Text
							className={`capitalize ${
								booking.status === 'confirmed'
									? 'text-green-500'
									: booking.status === 'pending'
										? 'text-yellow-500'
										: 'text-red-500'
							}`}
						>
							{booking.status}
						</Text>
					</View>

					{/* Total Price */}
					<View className="flex-row">
						<Text className="font-semibold text-black dark:text-white w-24">
							Total price:
						</Text>
						<Text className="text-gray-700 dark:text-gray-300">
							${booking.totalPrice}
						</Text>
					</View>

					{/* Created At */}
					<View className="flex-row">
						<Text className="font-semibold text-black dark:text-white w-24">
							Booked at:
						</Text>
						<Text className="text-gray-700 dark:text-gray-300">
							{formatDate(booking.createdAt)}
						</Text>
					</View>
				</View>
				<TouchableOpacity
					style={{ width: 60, height: 60 }}
					onPress={() => router.push(`${ROUTES.PROPERTIES}/${property?.$id}`)}
				>
					<Image
						source={{ uri: property?.image[0].image.url }}
						className="w-full h-full rounded-xl"
						resizeMode="cover"
					/>
				</TouchableOpacity>
			</View>
			<AgentContact agent={property?.agent} />
		</Paper>
	);
}
