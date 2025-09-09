import { Text, TouchableOpacity, View } from 'react-native';
import PropertyCard from '@/components/content/PropertyCard';
import { getMyProperties } from '@/lib/appwrite';
import { ROUTES } from '@/lib/constants/paths';
import { useGlobalContext } from '@/lib/global-provider';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomFlatList } from '@/components/shared/CustomFlatList';

export default function MyPropertiesScreen() {
	const { user } = useGlobalContext();

	const { data: properties, loading: propertiesLoading } = useAppwrite({
		fn: getMyProperties,
		params: { userId: user?.$id! },
	});
	return (
		<View className="flex-1 bg-white px-5 py-4">
			<TouchableOpacity
				className="bg-primary-300 py-2 px-4 rounded-full mb-4 flex flex-row items-center justify-center"
				onPress={() =>
					router.push({ pathname: ROUTES.PROPERTIES_ADD_PROPERTY })
				}
			>
				<MaterialIcons name="add" size={24} color="white" />
				<Text className="text-white font-bold text-center">
					Add New Property
				</Text>
			</TouchableOpacity>

			<CustomFlatList
				data={properties}
				isLoading={propertiesLoading}
				renderItem={(item, isGrid) => (
					<PropertyCard
						property={item}
						onPress={() => {
							router.push(`${ROUTES.PROPERTIES}/${item?.$id}`);
						}}
						isGrid={isGrid}
					/>
				)}
			/>
		</View>
	);
}
