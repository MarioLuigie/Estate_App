// modules
import { View } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
// lib
import { getMyProperties } from '@/lib/appwrite';
import { ROUTES } from '@/lib/constants/paths';
import { useGlobalContext } from '@/lib/global-provider';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
// components
import PropertyCard from '@/components/content/PropertyCard';
import { CustomFlatList } from '@/components/shared/CustomFlatList';
import CustomTouchable from '@/components/ui/CustomTouchable';

export default function MyPropertiesScreen() {
	const { user } = useGlobalContext();
	const [cardDeleted, setCardDeleted] = useState<boolean>(false);

	const {
		data: properties,
		loading: propertiesLoading,
		refetch,
	} = useAppwrite({
		fn: getMyProperties,
		params: { userId: user?.$id! },
	});

	useEffect(() => {
		refetch();
	}, [cardDeleted]);

	let preparedProperties: any[] = [];
	if (properties && properties?.length > 0) {
		preparedProperties = properties?.map((p) => ({
			...p,
			image: JSON.parse(p.image),
		}));
	}

	return (
		<View className="flex-1 bg-white px-5 py-4">
			{/* Add property button */}
			<CustomTouchable
				title="Add New Property"
				onPress={() =>
					router.push({ pathname: ROUTES.PROPERTIES_ADD_PROPERTY })
				}
				icon={<MaterialIcons name="add" size={24} color="white" />}
			/>

			{/* Remove all properties button */}
			<CustomTouchable
				title="Remove All Properties"
				onPress={() => {console.log("All items removed")}}
			/>

			<CustomFlatList
				data={preparedProperties}
				isLoading={propertiesLoading}
				renderItem={(item, isGrid) => (
					<PropertyCard
						property={item}
						onPress={() => {
							router.push(`${ROUTES.PROPERTIES}/${item?.$id}`);
						}}
						isGrid={isGrid}
						setCardDeleted={setCardDeleted}
					/>
				)}
			/>
		</View>
	);
}
