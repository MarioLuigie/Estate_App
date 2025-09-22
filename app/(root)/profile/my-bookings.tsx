// modules
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { getMyBookings } from '@/lib/actions/appwrite';

export default function MyBookingsScreen() {
	const insets = useSafeAreaInsets();

	const [bookings, setBookings] = useState<any[]>([]);

	useEffect(() => {
		const fetchMyBookingsList = async () => {
			try {
				const result = await getMyBookings();
				result && setBookings(result); 
			} catch (err) {
				console.error('Failed to fetch bookings:', err);
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
				{
					bookings.map((b, i) => (<Text key={i}>{b.$id}</Text>))
				}
				{/* <Text className="text-9xl">MY BOOKINGS SCREEN</Text>
				<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
				<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
				<Text className="text-9xl">MY BOOKINGS SCREEN</Text> */}
			</ScrollView>
		</View>
	);
}
