import { Text, FlatList, TouchableOpacity, View } from 'react-native';
// import PropertyCard from "@/components/content/PropertyCard";
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import { getMyProperties } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import PropertyCard from '@/components/content/PropertyCard';
import EmptyState from '@/components/shared/EmptyState';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES } from '@/lib/constants/paths';

export default function MyPropertiesScreen() {
	const { user } = useGlobalContext();
	const [isGrid, setIsGrid] = useState<boolean>(false);
	const insets = useSafeAreaInsets();

	const { data: properties, loading: propertiesLoading } = useAppwrite({
		fn: getMyProperties,
		params: { userId: user?.$id! },
	});

	console.log('MY PROPERTIES:', properties?.length);

	return (
		<View className="flex-1 bg-white px-5 py-4">
			<TouchableOpacity
				className="bg-primary-300 py-2 px-4 rounded-lg mb-4 flex flex-row items-center justify-center"
				onPress={() => router.push('/properties/add')}
			>
				<MaterialIcons name="add" size={24} color="white" />
				<Text className="text-white font-bold text-center">
					Add New Property
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				className="flex flex-row justify-end my-2"
				onPress={() => setIsGrid((pref) => !pref)}
			>
				<MaterialIcons
					name={isGrid ? 'view-column' : 'view-list'}
					size={36}
					color="#BDBDBD"
				/>
			</TouchableOpacity>

			<FlatList
				key={isGrid ? 'grid' : 'list'}
				data={properties}
				renderItem={({ item }) => (
					<PropertyCard
						property={item}
						onPress={() => {
							router.push(`${ROUTES.PROPERTIES}/${item?.$id}`);
						}}
					/>
				)}
				{...(isGrid && {
					numColumns: 2,
					columnWrapperClassName: 'flex gap-3',
				})}
				contentContainerStyle={{
					paddingBottom: insets.bottom,
				}}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => item.$id}
				ListEmptyComponent={<EmptyState isLoading={propertiesLoading} />}
			/>
		</View>
	);
}
