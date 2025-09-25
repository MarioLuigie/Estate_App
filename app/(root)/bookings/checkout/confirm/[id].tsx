import CustomTouchable from '@/components/ui/CustomTouchable';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { useBookingsStore } from '@/lib/store/bookings.store';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfirmPlaceOrder() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const insets = useSafeAreaInsets();

	const {
		startDate,
		endDate,
		property,
		status,
		totalPrice,
		fullName,
		email,
		phone,
		paymentMethod,
	} = useBookingsStore((state) => state);

	console.log(
		'PERSONAL DATA PM',
		startDate,
		endDate,
		property,
		status,
		totalPrice,
		fullName,
		email,
		phone,
		paymentMethod
	);

	return (
		<View className="flex-1 relative">
			<Text className="font-rubik-medium text-black text-xl mt-5 px-5">
				Place Order
			</Text>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					display: 'flex',
					gap: 7,
					paddingVertical: 7,
				}}
				className="flex-1 bg-white dark:bg-black gap-2 px-2"
			>
				<View style={{ marginHorizontal: 12 }}>
					<Text>CONFIRM AND PLACE ORDER</Text>
					<Text>{id}</Text>
				</View>
			</ScrollView>

			{/* BOOK NOW SECTION */}
			<View
				className="flex flex-row items-center bg-[#ffffffea] w-full border-t border-r border-l border-primary-200 px-5"
				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
			>
				<View className="flex flex-row items-center justify-end gap-10 w-full">
					<CustomTouchable
						title="Place Order"
						onPress={() =>
							router.push(`${ROUTES.BOOKINGS_CHECKOUT_CONFIRM}/${id}`)
						}
					/>
				</View>
			</View>
		</View>
	);
}
