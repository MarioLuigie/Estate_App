// modules
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
// components
import Label from '@/components/ui/Label';
import Paper from '@/components/ui/Paper';
import { PaymentMethod, Status } from '@/lib/constants/enums';
import { ROUTES } from '@/lib/constants/paths';
import { formatDate } from '@/lib/utils';
import { router } from 'expo-router';
import AgentContact from '../AgentContact';

interface BookingBookedProps {
	booking: {
		startDate: Date | null;
		endDate: Date | null;
		status: string;
		totalPrice: number;
		createdAt: string;
		paymentMethod?: PaymentMethod;
		fullName?: string;
		email?: string;
		phone?: string;
	};
	property: any;
}

export default function BookingBooked({
	booking,
	property,
}: BookingBookedProps) {
	return (
		<Paper>
			<Text
				className="text-black-200 text-xl font-rubik-bold pb-2"
				numberOfLines={1}
			>
				{property?.name}
			</Text>

			<View className="flex flex-row items-start justify-between">
				<View className="space-y-2">
					<View className="flex flex-col gap-2 mb-4">
						{/* Dates */}
						<View className="flex-row items-center">
							<Text className="font-semibold text-black dark:text-white w-24">
								Visit:
							</Text>
							<Label>
								<Text className="text-gray-700 dark:text-gray-300">
									{formatDate(booking!.startDate!)} -{' '}
									{formatDate(booking!.endDate!)}
								</Text>
							</Label>
						</View>

						{/* Status */}
						<View className="flex-row">
							<Text className="font-semibold text-black dark:text-white w-24">
								Status:
							</Text>
							<Text
								className={`font-rubik-medium capitalize ${
									booking.status === Status.CONFIRMED
										? 'text-green-500'
										: booking.status === Status.PENDING
											? 'text-yellow-500'
											: 'text-red-500'
								}`}
							>
								{booking.status}
							</Text>
						</View>
					</View>

					<View className="flex- flex-row justify-between items-center w-full">
						<View>
							{/* Total Price */}
							<View className="flex-row">
								<Text className="font-rubik-light text-black dark:text-white w-24">
									Total price:
								</Text>
								<Text className="font-rubik-light text-gray-700 dark:text-gray-300">
									${booking.totalPrice}
								</Text>
							</View>

							{/* Booked At */}
							<View className="flex-row">
								<Text className="font-rubik-light text-black dark:text-white w-24">
									Booked at:
								</Text>
								<Text className="font-rubik-light text-gray-700 dark:text-gray-300">
									{formatDate(booking.createdAt)}
								</Text>
							</View>
						</View>

						<TouchableOpacity
							style={{ width: 50, height: 50 }}
							onPress={() =>
								router.push(`${ROUTES.PROPERTIES}/${property?.$id}`)
							}
						>
							<Image
								source={{ uri: property?.image[0].image.url }}
								className="w-full h-full rounded-xl"
								resizeMode="cover"
								style={{ opacity: 0.8 }}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<AgentContact agent={property?.agent} />
		</Paper>
	);
}
