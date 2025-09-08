import { Text, FlatList, TouchableOpacity, View, ScrollView } from 'react-native';
// import PropertyCard from "@/components/content/PropertyCard";
import { router } from 'expo-router';

export default function MyPropertiesScreen() {
	return (
		<View className="flex-1 bg-white px-5 py-4">
			<TouchableOpacity
				className="bg-primary-300 py-2 px-4 rounded-lg mb-4"
				onPress={() => router.push('/properties/add')}
			>
				<Text className="text-white font-bold text-center">
					Add New Property
				</Text>
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

			{/* <FlatList
        data={properties}
        renderItem={({ item }) => <PropertyCard item={item} />}
        keyExtractor={(item) => item.$id}
      /> */}
		</View>
	);
}
