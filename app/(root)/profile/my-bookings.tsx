import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function MyBookingsScreen() {
	return (
		<View className="flex-1 bg-white px-5 py-4">
			<TouchableOpacity
				className="bg-primary-300 py-2 px-4 rounded-lg mb-4"
				onPress={() => router.push('/explore')}
			>
				<Text className="text-white font-bold text-center">Book more</Text>
			</TouchableOpacity>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 48 }}
				className="flex-1"
			>
				<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
				<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
				<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
				<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
			</ScrollView>
		</View>
	);
}
