import BookingSummary from '@/components/content/bookings/BookingSummary';
import CustomTouchable from '@/components/ui/CustomTouchable';
import { getPropertyById } from '@/lib/actions/properties.actions';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import { useBookingsStore } from '@/lib/store/bookings.store';
import { formatDateTime } from '@/lib/utils';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfirmPlaceOrderScreen() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const insets = useSafeAreaInsets();

	const setCreatedAt = useBookingsStore((state) => state.setCreatedAt);
	const setTransactionId = useBookingsStore((state) => state.setTransactionId);

	const [loading, setLoading] = useState(false);

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

	const { data: propertyData } = useAppwrite({
		fn: () => getPropertyById({ id: property }),
	});

	const booking = {
		startDate,
		endDate,
		property,
		status,
		totalPrice,
		fullName,
		email,
		phone,
		paymentMethod,
		createdAt: formatDateTime(new Date()),
	};

	// const handlePlaceOrder = async () => {
	// 	try {
	// 		setLoading(true);

	// 		// Tworzymy zamówienie PayPal przez Appwrite Function
	// 		const paypalOrder = await createPaypalOrder(
	// 			booking.totalPrice,
	// 			booking.id
	// 		);

	// 		// Otwórz okno płatności PayPal
	// 		// W React Native możesz użyć WebView lub paczki np. react-native-paypal
	// 		// Pseudokod:
	// 		const success = await openPaypalWebview(paypalOrder.links[1].href);
	// 		if (!success) throw new Error('User canceled or payment failed');

	// 		// Capture order przez Appwrite Function
	// 		const captureResult = await capturePaypalOrder(paypalOrder.id);

	// 		// Zapisz booking do Appwrite
	// 		await databases.createDocument(
	// 			config.databaseId,
	// 			config.bookingsCollectionId,
	// 			booking.id,
	// 			{ ...booking, status: 'paid', paypalOrderId: paypalOrder.id }
	// 		);

	// 		// Przekieruj po sukcesie
	// 		router.push(ROUTES.PROFILE_MY_BOOKINGS);
	// 	} catch (err: any) {
	// 		console.error(err);
	// 		Alert.alert('Payment error', err.message || 'Something went wrong');
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

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
					{propertyData && (
						<BookingSummary
							booking={booking}
							property={{ ...propertyData, agent: propertyData.agent }}
						/>
					)}
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
