import BookingSummary from '@/components/content/bookings/BookingSummary';
import CustomTouchable from '@/components/ui/CustomTouchable';
import { getPropertyById } from '@/lib/actions/properties.actions';
import { capturePaypalOrder, createPaypalOrder } from '@/lib/api/paypal.api';
import { Status } from '@/lib/constants/enums';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import * as Appwrite from '@/lib/services/appwrite';
import { useBookingsStore } from '@/lib/store/bookings.store';
import { formatDateTime } from '@/lib/utils';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Modal,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function ConfirmPlaceOrderScreen() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const insets = useSafeAreaInsets();

	const [loading, setLoading] = useState(false);
	const [webviewVisible, setWebviewVisible] = useState(false);
	const [webviewUrl, setWebviewUrl] = useState<string | null>(null);

	const {
		startDate,
		endDate,
		property,
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
		// id: id ?? `${Date.now()}`,
		startDate,
		endDate,
		property,
		totalPrice,
		fullName,
		email,
		phone,
		paymentMethod,
		createdAt: formatDateTime(new Date()),
		status: Status.PENDING,
	};

	const RETURN_URL = 'https://example.com/paypal-success';
	const CANCEL_URL = 'https://example.com/paypal-cancel';

	const handlePlaceOrder = async () => {
		try {
			setLoading(true);

			// 1️⃣ Tworzymy zamówienie w PayPal
			const data = await createPaypalOrder(
				// booking.totalPrice,
				// booking.id,
				booking
			);

			console.log("paypalOrder:", data)

			// 2️⃣ Otwórz WebView na approve link
			const approveLink = data.paypalOrder.links.find(
				(l: any) => l.rel === 'approve'
			)?.href;
			if (!approveLink) throw new Error('Brak linku do płatności PayPal');

			setWebviewUrl(approveLink);
			setWebviewVisible(true);
		} catch (err: any) {
			console.error(err);
			Alert.alert('Error', err.message || 'Something went wrong');
			setLoading(false);
		}
	};

	// Funkcja wykrywająca redirect po płatności
	const handleWebViewNavigationStateChange = async (navState: any) => {
		const { url } = navState;
		if (!url) return;

		if (url.startsWith(RETURN_URL)) {
			// 3️⃣ Wyciągamy orderId z URL
			const tokenMatch = url.match(/[?&]token=([^&]+)/);
			const orderId = tokenMatch ? tokenMatch[1] : null;
			setWebviewVisible(false);
			setWebviewUrl(null);
			if (!orderId) return;

			try {
				setLoading(true);

				// 4️⃣ Capture order
				const captureResult = await capturePaypalOrder(orderId);
				
				console.log("captureResult:", captureResult)

				// // 5️⃣ Zapis do Appwrite
				// await Appwrite.databases.createDocument(
				// 	Appwrite.config.databaseId!,
				// 	Appwrite.config.bookingsCollectionId!,
				// 	booking.id!,
				// 	{
				// 		...booking,
				// 		status: Status.CONFIRMED,
				// 		transactionId: captureResult.id ?? `sandbox-${Date.now()}`,
				// 		paypalCapture: captureResult,
				// 	}
				// );

				// 6️⃣ Przekierowanie po sukcesie
				router.push(ROUTES.PROFILE_MY_BOOKINGS);
			} catch (err: any) {
				console.error(err);
				Alert.alert('Capture Error', err.message || 'Payment failed');
			} finally {
				setLoading(false);
			}
		}

		if (url.startsWith(CANCEL_URL)) {
			setWebviewVisible(false);
			setWebviewUrl(null);
			Alert.alert('Payment cancelled');
		}
	};

	return (
		<View className="flex-1 relative">
			<Text className="font-rubik-medium text-black text-xl mt-5 px-5">
				Place Order
			</Text>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ gap: 7, paddingVertical: 7 }}
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

			{/* BUTTON */}
			<View
				className="flex flex-row items-center bg-[#ffffffea] w-full border-t border-r border-l border-primary-200 px-5"
				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
			>
				<CustomTouchable
					title="Place Order"
					onPress={handlePlaceOrder}
					disabled={loading}
				/>
			</View>

			{/* MODAL WebView */}
			<Modal
				visible={webviewVisible}
				animationType="slide"
				onRequestClose={() => setWebviewVisible(false)}
			>
				{webviewUrl ? (
					<WebView
						source={{ uri: webviewUrl }}
						onNavigationStateChange={handleWebViewNavigationStateChange}
						startInLoadingState
						renderLoading={() => <ActivityIndicator size="large" />}
					/>
				) : (
					<ActivityIndicator size="large" />
				)}
			</Modal>

			{loading && (
				<View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<ActivityIndicator size="large" />
				</View>
			)}
		</View>
	);
}

// import BookingSummary from '@/components/content/bookings/BookingSummary';
// import CustomTouchable from '@/components/ui/CustomTouchable';
// import { getPropertyById } from '@/lib/actions/properties.actions';
// import { capturePaypalOrder, createPaypalOrder } from '@/lib/api/paypal.api';
// import { TABS_HEIGHT } from '@/lib/constants/layout';
// import { ROUTES } from '@/lib/constants/paths';
// import { useAppwrite } from '@/lib/hooks/useAppwrite';
// import { useBookingsStore } from '@/lib/store/bookings.store';
// import { formatDateTime } from '@/lib/utils';
// import { router, useLocalSearchParams } from 'expo-router';
// import { useState } from 'react';
// import { Alert, ScrollView, Text, View } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import * as Appwrite from "@/lib/services/appwrite"

// export default function ConfirmPlaceOrderScreen() {
// 	const { id } = useLocalSearchParams<{ id?: string }>();
// 	const insets = useSafeAreaInsets();

// 	const setCreatedAt = useBookingsStore((state) => state.setCreatedAt);
// 	const setTransactionId = useBookingsStore((state) => state.setTransactionId);

// 	const [loading, setLoading] = useState(false);

// 	const {
// 		startDate,
// 		endDate,
// 		property,
// 		status,
// 		totalPrice,
// 		fullName,
// 		email,
// 		phone,
// 		paymentMethod,
// 	} = useBookingsStore((state) => state);

// 	const { data: propertyData } = useAppwrite({
// 		fn: () => getPropertyById({ id: property }),
// 	});

// 	const booking = {
// 		startDate,
// 		endDate,
// 		property,
// 		status,
// 		totalPrice,
// 		fullName,
// 		email,
// 		phone,
// 		paymentMethod,
// 		createdAt: formatDateTime(new Date()),
// 	};

// 	const handlePlaceOrder = async () => {
// 		try {
// 			setLoading(true);

// 			// Tworzymy zamówienie PayPal przez Appwrite Function
// 			const paypalOrder = await createPaypalOrder(
// 				booking.totalPrice,
// 				booking.id
// 			);

// 			// Otwórz okno płatności PayPal
// 			// W React Native możesz użyć WebView lub paczki np. react-native-paypal
// 			// Pseudokod:
// 			const success = await openPaypalWebview(paypalOrder.links[1].href);
// 			if (!success) throw new Error('User canceled or payment failed');

// 			// Capture order przez Appwrite Function
// 			const captureResult = await capturePaypalOrder(paypalOrder.id);

// 			// Zapisz booking do Appwrite
// 			await Appwrite.databases.createDocument(
// 				Appwrite.config.databaseId!,
// 				Appwrite.config.bookingsCollectionId!,
// 				booking!.id!,
// 				{ ...booking, status: 'paid', paypalOrderId: paypalOrder.id }
// 			);

// 			// Przekieruj po sukcesie
// 			router.push(ROUTES.PROFILE_MY_BOOKINGS);
// 		} catch (err: any) {
// 			console.error(err);
// 			Alert.alert('Payment error', err.message || 'Something went wrong');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<View className="flex-1 relative">
// 			<Text className="font-rubik-medium text-black text-xl mt-5 px-5">
// 				Place Order
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
// 					{propertyData && (
// 						<BookingSummary
// 							booking={booking}
// 							property={{ ...propertyData, agent: propertyData.agent }}
// 						/>
// 					)}
// 				</View>
// 			</ScrollView>

// 			{/* BOOK NOW SECTION */}
// 			<View
// 				className="flex flex-row items-center bg-[#ffffffea] w-full border-t border-r border-l border-primary-200 px-5"
// 				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
// 			>
// 				<View className="flex flex-row items-center justify-end gap-10 w-full">
// 					<CustomTouchable
// 						title="Place Order"
// 						onPress={() =>
// 							router.push(`${ROUTES.BOOKINGS_CHECKOUT_CONFIRM}/${id}`)
// 						}
// 					/>
// 				</View>
// 			</View>
// 		</View>
// 	);
// }
