// modules
import BookingSummary from '@/components/content/bookings/BookingSummary';
import CustomTouchable from '@/components/ui/CustomTouchable';
import { getMyBookings } from '@/lib/actions/actions.bookings';
import { getPropertiesByIds } from '@/lib/actions/actions.properties';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyBookingsScreen() {
	const insets = useSafeAreaInsets();

	const [bookings, setBookings] = useState<any[]>([]);
	const [bookedProperties, setBookedProperties] = useState<any[]>([]);

	const bookedPropertiesIds = bookings.map((b) => b.property);

	// console.log('my-bookings.tsx:', bookedPropertiesIds);

	useEffect(() => {
		const bookedProperties = async () => {
			try {
				const result = await getPropertiesByIds(bookedPropertiesIds);
				setBookedProperties && result && setBookedProperties(result);
			} catch (error) {
				console.error('Failed to fetch bookings:', error);
			}
		};
		bookedProperties();
	}, [bookings]);

	useEffect(() => {
		const fetchMyBookingsList = async () => {
			try {
				const result = await getMyBookings();
				result && setBookings(result);
			} catch (error) {
				console.error('Failed to fetch bookings:', error);
			}
		};

		fetchMyBookingsList();
	}, []);

	return (
		<View className="flex-1 bg-white px-5 py-4">
			<CustomTouchable
				onPress={() => router.push('/explore')}
				title="Book More"
				icon={<MaterialIcons name="search" size={24} color="white" />}
				containerStyle={{ marginBottom: 32 }}
			/>

			<View
				// showsVerticalScrollIndicator={false}
				// contentContainerStyle={{ paddingBottom: insets.bottom }}
				className="flex-1"
				style={{ paddingBottom: insets.bottom }}
			>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={bookings ?? []}
					renderItem={({ item }) => {
						const property = bookedProperties.find(
							(b) => b.$id === item.property
						);
						return (
							<BookingSummary
								key={item.$id}
								booking={item}
								property={property}
							/>
						);
					}}
					contentContainerStyle={{
						display: 'flex',
						flexDirection: 'column',
						gap: 12,
						alignItems: 'center',
					}}
				/>
			</View>
		</View>
	);
}
