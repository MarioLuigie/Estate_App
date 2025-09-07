import { Card } from '@/components/shared/Cards';
import EmptyState from '@/components/shared/EmptyState';
import Filters from '@/components/shared/Filters';
import PropertyMarker from '@/components/shared/PropertyMarker';
import Search from '@/components/shared/Search';
import { getProperties } from '@/lib/appwrite';
import icons from '@/lib/constants/icons';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
					{!showMap ? (
						<TouchableOpacity onPress={() => setShowMap(true)}>
							<Text className="text-base font-rubik-bold text-primary-300">
								See Map
							</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity onPress={() => setShowMap(false)}>
							<Text className="text-base font-rubik-bold text-primary-300">
								See List
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* PROPERTIES LIST */}
			{showMap ? (
				<MapView style={{ flex: 1 }}>
					{properties?.map((p) => (
						<PropertyMarker
							property={p}
							key={p.$id}
							onPress={() => handleCardPress(p.$id)}
						/>
					))}
				</MapView>
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
