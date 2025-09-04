import {
	SafeAreaView,
	Text,
	View,
	FlatList,
	ActivityIndicator,
} from 'react-native';
import Search from '@/components/shared/Search';
import { Card } from '@/components/shared/Cards';
import Filters from '@/components/shared/Filters';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/hooks/useAppwrite';
import { getProperties } from '@/lib/appwrite';
import { useEffect } from 'react';
import NoResults from '@/components/shared/NoReults';

export default function Explore() {
	const propertiesNumb = 20;

	const params = useLocalSearchParams<{ query?: string; filter?: string }>();

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
			{/* SEARCH */}
			<View className="px-5 my-4">
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
			<FlatList
				data={properties}
				renderItem={({ item }) => (
					<Card item={item} onPress={() => handleCardPress(item.$id)} />
				)}
				showsVerticalScrollIndicator={false}
				contentContainerClassName="pb-32"
				columnWrapperClassName="flex gap-3 px-5 pb-3"
				numColumns={2}
				keyExtractor={(item) => item.$id}
				ListEmptyComponent={
					propertiesLoading ? (
						<ActivityIndicator
							size="large"
							className="text-primary-300 mt-5"
						/>
					) : (
						<NoResults />
					)
				}
			/>
		</SafeAreaView>
	);
}
