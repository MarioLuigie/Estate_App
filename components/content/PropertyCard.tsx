import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import icons from '@/lib/constants/icons';
import { router } from 'expo-router';
// import { Property } from '@/lib/types/appwrite-types';

interface PropertyCardProps {
	property: any;
	onPress: () => void;
	isGrid?: boolean;
}

export default function PropertyCard({
	property,
	onPress,
	isGrid,
}: PropertyCardProps) {
	console.log('IS GRID FROM PropertyCard:', isGrid);

	return (
		<TouchableOpacity
			className={`bg-white rounded-xl shadow-md overflow-hidden mb-4 border border-mygrey-300 relative ${isGrid ? 'flex-1' : 'w-full'}`}
			onPress={onPress}
			activeOpacity={0.8}
		>
			{/* EDIT PROPERTY ICON */}
			<TouchableOpacity
				className="absolute z-50 top-4 right-4"
				onPress={() => {
					router.push(`/properties/update/${property?.$id}`);
				}}
			>
				<MaterialIcons name="edit" size={28} color="white" />
			</TouchableOpacity>

			{/* Obraz główny */}
			{property?.image && (
				<Image
					source={{ uri: property?.image }}
					className="w-full h-40"
					resizeMode="cover"
				/>
			)}

			{/* Treść */}
			<View className="p-4">
				{/* Nazwa nieruchomości */}
				<Text className="text-lg font-semibold text-black-300 mb-1">
					{property?.name}
				</Text>

				{/* Cena */}
				<Text className="text-base font-bold text-primary-300 mb-1">
					${property?.price.toLocaleString()}
				</Text>

				{/* Podstawowe informacje */}
				<View className="flex-row justify-between mt-2 flex-wrap">
					<View className="flex flex-col items-center">
						<View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
							<Image source={icons.bed} className="size-4" />
						</View>
						<Text className="text-sm text-gray-500">
							{property?.bedrooms} Beds
						</Text>
					</View>

					<View className="flex flex-col items-center">
						<View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
							<Image source={icons.bath} className="size-4" />
						</View>
						<Text className="text-sm text-gray-500">
							{property?.bathrooms} Baths
						</Text>
					</View>

					<View className="flex flex-col items-center">
						<View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
							<Image source={icons.area} className="size-4" />
						</View>
						<Text className="text-sm text-gray-500">
							{property?.area} m2
						</Text>
					</View>
				</View>

				{/* Ocena */}
				{property.rating && (
					<Text className="text-sm text-yellow-500 mt-2">
						⭐ {property?.rating}
					</Text>
				)}
			</View>
		</TouchableOpacity>
	);
}
