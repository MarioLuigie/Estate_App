import icons from '@/constants/icons';
import {
	SafeAreaView,
	Text,
	View,
	Image,
	TouchableOpacity,
	FlatList,
	Button,
} from 'react-native';
import Search from '@/components/shared/Search';
import { FeaturedCard, Card } from '@/components/shared/Cards';
import Filters from '@/components/shared/Filters';
import { useGlobalContext } from '@/lib/global-provider';
import { getTimeGreeting } from '@/tools';
import seed from '@/lib/seed';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/hooks/useAppwrite';
import { getLatestProperties, getProperties } from '@/lib/appwrite';
import { useEffect } from 'react';
import EmptyState from '@/components/shared/EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TABS_HEIGHT, REC_PROPERTIES_LIMIT } from '@/constants/layout';

export default function Home() {
	const { user } = useGlobalContext();
	const insets = useSafeAreaInsets();
	const greeting = getTimeGreeting();

	const isSeedButtonHidden: boolean = !true;

	const params = useLocalSearchParams<{ query?: string; filter?: string }>();

	const { loading: latestPropertiesLoading, data: latestProperties } =
		useAppwrite({
			fn: () => getLatestProperties(),
		});

	const {
		loading: propertiesLoading,
		data: properties,
		refetch,
	} = useAppwrite({
		fn: getProperties,
		params: {
			filter: params.filter!,
			query: params.query!,
			limit: REC_PROPERTIES_LIMIT,
		},
		skip: true,
	});

	useEffect(() => {
		refetch({
			filter: params.filter!,
			query: params.query!,
			limit: REC_PROPERTIES_LIMIT,
		});
	}, [params.filter, params.query]);

	const handleCardPress = (id: string) => {
		router.push(`/properties/${id}`);
	};

	return (
		<SafeAreaView className="h-full bg-white">
			{!isSeedButtonHidden && (
				<View style={{paddingTop: insets.top}}>
					<Button title="Seed" onPress={seed} />
				</View>
			)}
			{/* HEADER */}
			<View className="px-5" style={{marginTop: insets.top + 16}}>
				<View className="flex flex-row items-center justify-between">
					<View className="flex flex-row items-center">
						<View>
							<Image
								source={{ uri: user?.avatar }}
								className="size-12 rounded-full"
							/>
						</View>

						<View className="flex flex-col items-start justify-center ml-2">
							<Text className="text-xs font-rubik text-black-100">
								{greeting}
							</Text>
							<Text className="text-base font-rubik-medium text-black-300">
								{user?.name}
							</Text>
						</View>
					</View>
					<Image source={icons.bell} className="size-6" />
				</View>
			</View>

			{/* SEARCH */}
			<View className="px-5 my-4">
				<Search />
			</View>

			{/* MAIN */}
			<FlatList
				data={properties}
				renderItem={({ item }) => (
					<Card item={item} onPress={() => handleCardPress(item.$id)} />
				)}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: TABS_HEIGHT}}
				columnWrapperClassName="flex gap-3 px-5 pb-3"
				numColumns={2}
				keyExtractor={(item) => item.$id}
				ListEmptyComponent={<EmptyState isLoading={propertiesLoading} />}
				ListHeaderComponent={
					<View className="px-5 pb-5">
						{/* FEATURED */}
						<View className="my-5 flex flex-col items-center">
							<View className="w-full flex flex-row items-center justify-between mb-4">
								<Text className="text-xl font-rubik-bold text-black-300">
									Featured
								</Text>
								<TouchableOpacity>
									<Text className="text-base font-rubik-bold text-primary-300">
										See all
									</Text>
								</TouchableOpacity>
							</View>

							<FlatList
								data={latestProperties}
								renderItem={({ item }) => (
									<FeaturedCard
										item={item}
										onPress={() => handleCardPress(item.$id)}
									/>
								)}
								showsHorizontalScrollIndicator={false}
								contentContainerClassName="flex gap-3"
								horizontal
								bounces={false}
								keyExtractor={(item) => item.$id}
								ListEmptyComponent={
									<EmptyState isLoading={latestPropertiesLoading} />
								}
							/>
						</View>

						{/* OUR RECOMMANDATION */}
						<View>
							<View className="flex flex-row items-center justify-between mb-4">
								<Text className="text-xl font-rubik-bold text-black-300">
									Our Recommendation
								</Text>
								<TouchableOpacity>
									<Text className="text-base font-rubik-bold text-primary-300">
										See all
									</Text>
								</TouchableOpacity>
							</View>

							<Filters />
						</View>
					</View>
				}
			/>
		</SafeAreaView>
	);
}

// import icons from '@/constants/icons';
// import images from '@/constants/images';
// import {
// 	SafeAreaView,
// 	Text,
// 	View,
// 	Image,
// 	TouchableOpacity,
// 	ScrollView,
// } from 'react-native';
// import Search from '@/components/Search';
// import { FeaturedCard, Card } from '@/components/Cards';
// import Filters from '@/components/Filters';

// export default function Home() {
// 	return (
// 		<SafeAreaView className="h-full bg-white">
// 			{/* HEADER */}
// 			<View className="px-5">
// 				<View className="flex flex-row items-center justify-between mt-16">
// 					<View className="flex flex-row items-center">
// 						<View>
// 							<Image
// 								source={images.avatar}
// 								className="size-12 rounded-full"
// 							/>
// 						</View>

// 						<View className="flex flex-col items-start justify-center ml-2">
// 							<Text className="text-xs font-rubik text-black-100">
// 								Good Morning
// 							</Text>
// 							<Text className="text-base font-rubik-medium text-black-300">
// 								Mariusz
// 							</Text>
// 						</View>
// 					</View>
// 					<Image source={icons.bell} className="size-6" />
// 				</View>
// 			</View>

// 			{/* SEARCH */}
// 			<View className="px-5 mb-4">
// 				<Search />
// 			</View>

// 			{/* MAIN */}
// 			<ScrollView contentContainerClassName="pb-28" className="px-5">
// 				{/* FEATURED */}
// 				<View className="my-5">
// 					<View className="flex flex-row items-center justify-between">
// 						<Text className="text-xl font-rubik-bold text-black-300">
// 							Featured
// 						</Text>
// 						<TouchableOpacity>
// 							<Text className="text-base font-rubik-bold text-primary-300">
// 								See all
// 							</Text>
// 						</TouchableOpacity>
// 					</View>

// 					<ScrollView
// 						horizontal
// 						showsHorizontalScrollIndicator={false}
// 						className="my-3"
// 					>
// 						<View className="mr-5">
// 							<FeaturedCard onPress={() => {}} />
// 						</View>
// 						<View className="mr-5">
// 							<FeaturedCard onPress={() => {}} />
// 						</View>
// 						<View className="mr-5">
// 							<FeaturedCard onPress={() => {}} />
// 						</View>
// 					</ScrollView>
// 				</View>

// 				{/* OUR RECOMMANDATION */}
// 				<View className="my-5">
// 					<View className="flex flex-row items-center justify-between mb-4">
// 						<Text className="text-xl font-rubik-bold text-black-300">
// 							Our Recommandation
// 						</Text>
// 						<TouchableOpacity>
// 							<Text className="text-base font-rubik-bold text-primary-300">
// 								See all
// 							</Text>
// 						</TouchableOpacity>
// 					</View>

// 					<View className='mb-4'>
// 						<Filters />
// 					</View>

// 					<ScrollView
// 						horizontal
// 						showsHorizontalScrollIndicator={false}
// 						className="mb-4"
// 					>
// 						<View className="mr-5">
// 							<Card />
// 						</View>

// 						<View className="mr-5">
// 							<Card />
// 						</View>

// 						<View className="mr-5">
// 							<Card />
// 						</View>
// 					</ScrollView>
// 				</View>
// 			</ScrollView>
// 		</SafeAreaView>
// 	);
// }

// import { Link } from 'expo-router';
// import { SafeAreaView, StyleSheet, Text } from 'react-native';

// export default function Home() {
// 	return (
// 		<SafeAreaView style={styles.container} className='h-full bg-white'>
// 			<Text className='text-xl my-10 font-rubik-bold'>Home</Text>
// 		</SafeAreaView>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 	},
// });
