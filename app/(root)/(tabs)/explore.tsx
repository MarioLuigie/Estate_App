import {
	SafeAreaView,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	Image,
} from 'react-native';
import Search from '@/components/shared/Search';
import { Card } from '@/components/shared/Cards';
import Filters from '@/components/shared/Filters';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/hooks/useAppwrite';
import { getProperties } from '@/lib/appwrite';
import { useEffect, useState } from 'react';
import icons from '@/constants/icons';
import EmptyState from '@/components/shared/EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TABS_HEIGHT } from '@/constants/layout';

export default function Explore() {
	const propertiesNumb = 20;

	const params = useLocalSearchParams<{ query?: string; filter?: string }>();
	const insets = useSafeAreaInsets();
	const [showMap, setShowMap] = useState<boolean>(!true);

	const {
		loading: propertiesLoading,
		data: properties,
		refetch,
	} = useAppwrite({
		fn: getProperties,
		params: {
			filter: params.filter!,
			query: params.query!,
			limit: propertiesNumb,
		},
		skip: true,
	});

	useEffect(() => {
		refetch({
			filter: params.filter!,
			query: params.query!,
			limit: propertiesNumb,
		});
	}, [params.filter, params.query]);

	const handleCardPress = (id: string) => {
		router.push(`/properties/${id}`);
	};

	return (
		<SafeAreaView className="h-full bg-white">
			{/* BACK NAVIGATION */}
			<View
				className="px-5 mb-4 flex flex-row items-center justify-between"
				style={{ marginTop: insets.top + 16 }}
			>
				<TouchableOpacity
					onPress={() => router.back()}
					className="flex flex-row items-center justify-center size-11 rounded-full bg-mygrey-200"
				>
					<Image source={icons.backArrow} className="size-6" />
				</TouchableOpacity>
				<Text className="text-base mr-2 font-rubik-medium text-black-300">
					Search for your ideal Home
				</Text>
				<Image source={icons.bell} className="size-6" />
			</View>

			{/* SEARCH */}
			<View className="px-5 mb-4">
				<Search />
			</View>

			{/* FILTERS */}
			<View className="px-5 mb-4">
				<Filters />
			</View>

			{/* FOUNDED PROPERTIES */}
			<View className="px-5">
				<View className="flex flex-row items-center justify-between mb-4">
					<Text className="text-xl font-rubik-medium text-black-300">
						Found {properties?.length} Properties
					</Text>
				</View>
			</View>

			{/* PROPERTIES LIST */}

			{showMap ? (
				<View></View>
			) : (
				<FlatList
					data={properties}
					renderItem={({ item }) => (
						<Card item={item} onPress={() => handleCardPress(item.$id)} />
					)}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: TABS_HEIGHT }}
					columnWrapperClassName="flex gap-3 px-5 pb-3"
					numColumns={2}
					keyExtractor={(item) => item.$id}
					ListEmptyComponent={<EmptyState isLoading={propertiesLoading} />}
				/>
			)}
		</SafeAreaView>
	);
}
