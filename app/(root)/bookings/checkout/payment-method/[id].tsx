import CustomTouchable from '@/components/ui/CustomTouchable';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { useBookingsStore } from '@/lib/store/bookings.store';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PaymentMethod } from '@/lib/constants/enums';

export default function PaymentMethodScreen() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const insets = useSafeAreaInsets();
	const { paymentMethod, setPaymentMethod } = useBookingsStore(
		(state) => state
	);
	const [selectedMethod, setSelectedMethod] =
		useState<PaymentMethod>(paymentMethod);

	const {
		startDate,
		endDate,
		property,
		status,
		totalPrice,
		fullName,
		email,
		phone,
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
		phone
	);

	const handleSelectMethod = (method: PaymentMethod) => {
		setSelectedMethod(method);
		setPaymentMethod(method);
	};

	const handleCheckout = () => {
		router.push(`${ROUTES.BOOKINGS_CHECKOUT_CONFIRM}/${id}`);
	};

	return (
		<View className="flex-1 relative">
			<Text className="font-rubik-medium text-black text-xl mt-5 px-5">
				Select Payment Method
			</Text>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					display: 'flex',
					gap: 12,
					paddingVertical: 12,
				}}
				className="flex-1 bg-white dark:bg-black px-5"
			>
				{/* PayPal */}
				<TouchableOpacity
					onPress={() => handleSelectMethod(PaymentMethod.PAYPAL)}
					className={`p-4 rounded-xl border ${
						selectedMethod === PaymentMethod.PAYPAL
							? 'border-blue-500'
							: 'border-gray-300'
					}`}
				>
					<Text className="text-lg">PayPal</Text>
				</TouchableOpacity>

				{/* Stripe */}
				<TouchableOpacity
					onPress={() => handleSelectMethod(PaymentMethod.STRIPE)}
					className={`p-4 rounded-xl border ${
						selectedMethod === PaymentMethod.STRIPE
							? 'border-blue-500'
							: 'border-gray-300'
					}`}
				>
					<Text className="text-lg">Stripe</Text>
				</TouchableOpacity>
			</ScrollView>

			{/* BOOK NOW SECTION */}
			<View
				className="flex flex-row items-center bg-[#ffffffea] w-full border-t border-r border-l border-primary-200 px-5"
				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
			>
				<View className="flex flex-row items-center justify-end gap-10 w-full">
					<CustomTouchable title="Continue" onPress={handleCheckout} />
				</View>
			</View>
		</View>
	);
}

// import CustomTouchable from '@/components/ui/CustomTouchable';
// import { TABS_HEIGHT } from '@/lib/constants/layout';
// import { ROUTES } from '@/lib/constants/paths';
// import { useBookingsStore } from '@/lib/store/bookings.store';
// import { router, useLocalSearchParams } from 'expo-router';
// import React from 'react';
// import { View, Text, ScrollView } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function PaymentMethod() {
// 	const { id } = useLocalSearchParams<{ id?: string }>();
// 	const insets = useSafeAreaInsets();
// 	const { startDate, endDate, property, status, fullName, email, phone } =
// 		useBookingsStore((state) => state);

// 	console.log(
// 		'PERSONAL DATA PM',
// 		startDate,
// 		endDate,
// 		property,
// 		status,
// 		fullName,
// 		email,
// 		phone
// 	);
// 	return (
// 		<View className="flex-1 relative">
// 			<Text className="font-rubik-medium text-black text-xl my-4 px-5">
// 				Select Payment Method
// 			</Text>
// 			<ScrollView
// 				showsVerticalScrollIndicator={false}
// 				contentContainerStyle={{
// 					display: 'flex',
// 					gap: 7,
// 					paddingVertical: 7,
// 				}}
// 				className="flex-1 bg-white dark:bg-black gap-2 px-2"
// 			>
// 				<View style={{ marginHorizontal: 12 }}>
// 					<Text>PAYMENT METHOD</Text>
// 					<Text>{id}</Text>
// 				</View>
// 			</ScrollView>

// 			{/* BOOK NOW SECTION */}
// 			<View
// 				className="flex flex-row items-center bg-[#ffffffea] w-full border-t border-r border-l border-primary-200 px-5"
// 				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
// 			>
// 				<View className="flex flex-row items-center justify-between gap-10 w-full">
// 					<CustomTouchable
// 						title="Checkout"
// 						onPress={() =>
// 							router.push(`${ROUTES.BOOKINGS_CHECKOUT_CONFIRM}/${id}`)
// 						}
// 					/>
// 				</View>
// 			</View>
// 		</View>
// 	);
// }
