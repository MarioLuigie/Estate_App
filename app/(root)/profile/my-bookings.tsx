import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyBookingsScreen() {
	const insets = useSafeAreaInsets()
	return (
		<View className="flex-1 bg-white px-5 py-4">
			<TouchableOpacity
				className="bg-primary-300 py-2 px-4 rounded-lg mb-4 flex flex-row justify-center items-center gap-2"
				onPress={() => router.push('/explore')}
			>
        <MaterialIcons name="search" size={24} color="white" />
				<Text className="text-white font-bold text-center">Book more properties</Text>
			</TouchableOpacity>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: insets.bottom }}
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

// import { router } from 'expo-router';
// import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function MyBookingsScreen() {
// 	const insets = useSafeAreaInsets()
// 	return (
// 		<View className="flex-1 bg-white px-5 py-4">
// 			<TouchableOpacity
// 				className="bg-primary-300 py-2 px-4 rounded-lg mb-4 flex flex-row justify-center items-center gap-2"
// 				onPress={() => router.push('/explore')}
// 			>
//         <MaterialIcons name="search" size={24} color="white" />
// 				<Text className="text-white font-bold text-center">Book more properties</Text>
// 			</TouchableOpacity>

// 			<ScrollView
// 				showsVerticalScrollIndicator={false}
// 				contentContainerStyle={{ paddingBottom: insets.bottom }}
// 				className="flex-1"
// 			>
// 				<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
// 				<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
// 				<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
// 				<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
// 				<Text className="text-4xl">yes</Text>
// 			</ScrollView>
// 		</View>
// 	);
// }

