// modules
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Dispatch, SetStateAction, useState } from 'react';
import { router } from 'expo-router';
// lib
import icons from '@/lib/constants/icons';
import { deleteMyPropertyAtomic } from '@/lib/appwrite';
// components
import CustomModal from '@/components/shared/CustomModal';
import IconButton from '@/components/ui/IconButton';

interface PropertyCardProps {
	property: any;
	onPress: () => void;
	isGrid?: boolean;
	setCardDeleted?: Dispatch<SetStateAction<boolean>>;
}

export default function PropertyCard({
	property,
	onPress,
	isGrid,
	setCardDeleted,
}: PropertyCardProps) {
	const [deleteVisible, setDeleteVisible] = useState<boolean>(false);

	const handleEdit = () => {
		router.push(`/properties/update/${property?.$id}`);
	};

	const handleDelete = async () => {
		const result = await deleteMyPropertyAtomic(
			property?.$id,
			property?.image?.fileId
		);
		setCardDeleted && setCardDeleted(result);
	};

	return (
		<TouchableOpacity
			className={`bg-white rounded-xl shadow-md overflow-hidden mb-4 border border-mygrey-300 relative ${isGrid ? 'flex-1' : 'w-full'}`}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<View className="absolute z-50 top-4 right-4 flex flex-row gap-3 bg-red-600">
				{/* EDIT PROPERTY ICON */}
				<IconButton
					icon={<MaterialIcons name="edit" size={28} color="white" />}
					onPress={handleEdit}
					containerStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
				/>

				{/* DELETE PROPERTY ICON */}
				<IconButton
					icon={<MaterialIcons name="delete" size={28} color="white" />}
					onPress={() => setDeleteVisible(true)}
					containerStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
				/>
			</View>

			{/* Obraz główny */}
			{property?.image && (
				<Image
					source={{ uri: property?.image?.url }}
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

			<CustomModal
				visible={deleteVisible}
				title="Confirm Delete"
				message="Are you sure you want to delete?"
				actionMessage='Property is deleting now.'
				onConfirm={handleDelete}
				onCancel={() => setDeleteVisible(false)}
				isChecked
			/>
		</TouchableOpacity>
	);
}
