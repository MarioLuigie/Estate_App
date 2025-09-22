// modules
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { getMyBookings, getPropertiesByIds } from '@/lib/actions/appwrite';
import BookingSummary from '@/components/content/BookingSummary';

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
			<TouchableOpacity
				className="bg-primary-300 py-2 px-4 rounded-lg mb-4 flex flex-row justify-center items-center gap-2"
				onPress={() => router.push('/explore')}
			>
				<MaterialIcons name="search" size={24} color="white" />
				<Text className="text-white font-bold text-center">
					Book more properties
				</Text>
			</TouchableOpacity>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: insets.bottom }}
				className="flex-1"
			>
				<View className="flex gap-3">
					{bookings.map((b) => {
						const property = bookedProperties.find(
							(p) => p.$id === b.property
						);

						return (
							<BookingSummary
								key={b.$id}
								booking={b}
								property={property}
							/>
						);
					})}
				</View>
			</ScrollView>
		</View>
	);
}
