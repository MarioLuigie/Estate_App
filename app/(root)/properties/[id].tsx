// modules
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	Dimensions,
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// lib
import {
	getAgentById,
	getPropertyById,
} from '@/lib/actions/properties.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import images from '@/lib/constants/images';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { useGlobalContext } from '@/lib/context/global-provider';
// components
import AgentContact from '@/components/content/AgentContact';
import Facilities from '@/components/content/properties/PropertyDetails/Facilities';
import Gallery from '@/components/content/properties/PropertyDetails/Gallery';
import Intro from '@/components/content/properties/PropertyDetails/Intro';
import Location from '@/components/content/properties/PropertyDetails/Location';
import Overview from '@/components/content/properties/PropertyDetails/Overview';
import Reviews from '@/components/content/properties/PropertyDetails/Reviews';
import NavigateBack from '@/components/shared/NavigateBack';
import CustomTouchable from '@/components/ui/CustomTouchable';
import LikeButton from '@/components/ui/LikeButton';
import SendButton from '@/components/ui/SendButton';
import { ContactMethod } from '@/lib/constants/enums';
import { useLikesStore } from '@/lib/store/likes.store';
import { contact } from '@/lib/tools';

export default function PropertyDetails() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const insets = useSafeAreaInsets();
	const { authUser } = useGlobalContext();
	const windowHeight = Dimensions.get('window').height;

	const [property, setProperty] = useState<any>(null);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [agent, setAgent] = useState<any>(null);
	const [agentLoading, setAgentLoading] = useState(false);

	const likes = useLikesStore((s) => s.likes);

	// Pobieramy property dopiero gdy mamy id
	// useEffect(() => {
	//   if (!id) return;

	//   getPropertyById({ id })
	//     .then(setProperty)
	//     .catch(console.error);
	// }, [id]);

	useEffect(() => {
		if (!id) return;

		getPropertyById({ id })
			.then((property) => {
				setProperty(property); // ustawienie property w lokalnym stanie

				const likesState = useLikesStore.getState().likes;
				if (!likesState[id]) {
					// jeśli nie ma wpisu w stanie likes, dodaj nowy
					useLikesStore.getState().setLike(id, false, 0, null);
				}
			})
			.catch(console.error);
	}, [id]);

	// Pobieramy currentUser dopiero gdy mamy authUser
	useEffect(() => {
		if (!authUser?.$id) return;

		getCurrentUser({ authId: authUser.$id })
			.then(setCurrentUser)
			.catch(console.error);
	}, [authUser]);

	// Pobieramy agenta dopiero gdy property jest dostępne
	useEffect(() => {
		if (!property?.agent) return;

		setAgentLoading(true);
		getAgentById({ id: property.agent })
			.then(setAgent)
			.finally(() => setAgentLoading(false));
	}, [property?.agent]);

	// Jeśli jeszcze nie mamy currentUser lub property, renderujemy null
	if (!currentUser || !property) return null;

	return (
		<SafeAreaView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					backgroundColor: 'white',
					paddingBottom: insets.bottom + TABS_HEIGHT,
				}}
			>
				{/* PROPERTY IMAGE */}
				<View
					className="relative w-full"
					style={{ height: windowHeight / 2 }}
				>
					<Image
						source={{ uri: property.image[0].image.url }}
						className="size-full"
						resizeMode="cover"
					/>
					<Image
						source={images.whiteGradient}
						className="absolute top-0 w-full z-40"
					/>

					{/* BACK NAVIGATION + LikeButton */}
					<View
						className="z-50 absolute px-5 py-2 bg-white/60 w-full"
						style={{ top: insets.top + 16 }}
					>
						<NavigateBack>
							<View className="w-full flex-1 flex flex-row justify-end">
								<View className="flex flex-row items-center gap-4">
									<LikeButton propertyId={property.$id} />
									<SendButton
										onPress={() =>
											contact({
												type: ContactMethod.EMAIL,
												value: agent.email,
											})
										}
									/>
								</View>
							</View>
						</NavigateBack>
					</View>
				</View>

				{/* PROPERTY SECTIONS */}
				<View className="px-5 my-7 flex gap-2">
					<Intro property={property} />
					<AgentContact agent={agent} />
					<Overview property={property} />
					<Facilities property={property} />
					<Gallery property={property} />
					<Location property={property} />
					<Reviews property={property} />
				</View>
			</ScrollView>

			{/* BOOK NOW */}
			<View
				className="absolute flex flex-row items-center bg-[#ffffffea] bottom-0 w-full border-t border-r border-l border-primary-200 px-5"
				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
			>
				<View className="flex flex-row items-center justify-between gap-10 w-full">
					<View className="flex flex-col items-start">
						<Text className="text-black-200 text-xs font-rubik-medium">
							Price/Night
						</Text>
						<Text
							numberOfLines={1}
							className="text-primary-300 text-start text-2xl font-rubik-bold"
						>
							${property.price}
						</Text>
					</View>

					<CustomTouchable
						title="Book Now"
						onPress={() =>
							router.push({
								pathname: ROUTES.BOOKINGS_BOOK_BOOKING,
								params: { id: property.$id },
							})
						}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

// // modules
// import { router, useLocalSearchParams } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
// 	Dimensions,
// 	Image,
// 	SafeAreaView,
// 	ScrollView,
// 	Text,
// 	View,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // lib
// import {
// 	getAgentById,
// 	getCurrentUser,
// 	getPropertyById,
// } from '@/lib/actions/appwrite';
// import images from '@/lib/constants/images';
// import { useAppwrite } from '@/lib/hooks/useAppwrite';
// // components
// import AgentContact from '@/components/content/PropertySections/AgentContact';
// import Facilities from '@/components/content/PropertySections/Facilities';
// import Gallery from '@/components/content/PropertySections/Gallery';
// import Intro from '@/components/content/PropertySections/Intro';
// import Location from '@/components/content/PropertySections/Location';
// import Overview from '@/components/content/PropertySections/Overview';
// import Reviews from '@/components/content/PropertySections/Reviews';
// import NavigateBack from '@/components/shared/NavigateBack';
// import CustomTouchable from '@/components/ui/CustomTouchable';
// import LikeButton from '@/components/ui/LikeButton';
// import SendButton from '@/components/ui/SendButton';
// import { TABS_HEIGHT } from '@/lib/constants/layout';
// import { ROUTES } from '@/lib/constants/paths';
// import { featureNotAvailable } from '@/lib/tools';
// import { useGlobalContext } from '@/lib/global-provider';

// export default function PropertyDetails() {
// 	const { id } = useLocalSearchParams<{ id?: string }>();
// 	const insets = useSafeAreaInsets();
// 	const { authUser } = useGlobalContext();

// 	const windowHeight = Dimensions.get('window').height;

// 	const { data: property } = useAppwrite({
// 		fn: getPropertyById,
// 		params: {
// 			id: id!,
// 		},
// 	});

// 	// if (property && typeof property.image[0].image === 'string') {
// 	// 	property.image = [JSON.parse(property.image[0].image)];
// 	// }

// 	const [agent, setAgent] = useState<any>(null);
// 	const [agentLoading, setAgentLoading] = useState(false);

// 	useEffect(() => {
// 		if (!property?.agent) return;

// 		setAgentLoading(true);
// 		getAgentById({ id: property.agent })
// 			.then((res) => setAgent(res))
// 			.finally(() => setAgentLoading(false));
// 	}, [property?.agent]);

// 	// console.log('Property latitude:', property?.latitude);
// 	// console.log('Property longitude:', property?.longitude);

// 	const { data: currentUser } = useAppwrite({
// 		fn: getCurrentUser,
// 		params: authUser ? { authId: authUser.$id } : undefined,
// 		skip: !authUser, // nie wywołuj requestu dopóki nie ma authUser
// 	});

// 	if (!currentUser) {
// 		return null;
// 	}

// 	return (
// 		<SafeAreaView>
// 			<ScrollView
// 				showsVerticalScrollIndicator={false}
// 				contentContainerStyle={{
// 					backgroundColor: 'white',
// 					paddingBottom: insets.bottom + TABS_HEIGHT,
// 				}}
// 			>
// 				<View
// 					className="relative w-full"
// 					style={{ height: windowHeight / 2 }}
// 				>
// 					<Image
// 						source={{ uri: property?.image[0].image.url }}
// 						className="size-full"
// 						resizeMode="cover"
// 					/>

// 					<Image
// 						source={images.whiteGradient}
// 						className="absolute top-0 w-full z-40"
// 					/>

// 					{/* BACK NAVIGATION */}
// 					<View
// 						className="z-50 absolute px-5 py-2 bg-white/60"
// 						style={{
// 							top: insets.top + 16,
// 						}}
// 					>
// 						<NavigateBack>
// 							<View className="flex flex-row items-center gap-4">
// 								<LikeButton
// 									propertyId={property?.$id}
// 									userId={currentUser!.$id}
// 									initialCount={0}
// 								/>
// 								<SendButton onPress={() => featureNotAvailable()} />
// 							</View>
// 						</NavigateBack>
// 					</View>
// 				</View>

// 				{/* PROPERTY SECTION */}
// 				<View className="px-5 my-7 flex gap-2">
// 					{/* INTRO FIRST INFO SECTION */}
// 					<Intro property={property} />

// 					{/* AGENT SECTION */}
// 					<AgentContact agent={agent} />

// 					{/* OVERVIEW SECTION */}
// 					<Overview property={property} />

// 					{/* FACILITIES SECTION */}
// 					<Facilities property={property} />

// 					{/* GALLERY SECTION */}
// 					<Gallery property={property} />

// 					{/* LOCATION SECTION */}
// 					<Location property={property} />

// 					{/* REVIEWS SECTION */}
// 					<Reviews property={property} />
// 				</View>
// 			</ScrollView>

// 			{/* BOOK NOW SECTION */}
// 			<View
// 				className="absolute flex flex-row items-center bg-[#ffffffea] bottom-0 w-full border-t border-r border-l border-primary-200 px-5"
// 				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
// 			>
// 				<View className="flex flex-row items-center justify-between gap-10 w-full">
// 					<View className="flex flex-col items-start">
// 						<Text className="text-black-200 text-xs font-rubik-medium">
// 							Price/Night
// 						</Text>
// 						<Text
// 							numberOfLines={1}
// 							className="text-primary-300 text-start text-2xl font-rubik-bold"
// 						>
// 							${property?.price}
// 						</Text>
// 					</View>

// 					<CustomTouchable
// 						title="Book Now"
// 						onPress={() =>
// 							router.push({
// 								pathname: ROUTES.BOOKINGS_BOOK_BOOKING,
// 								params: { id: property?.$id },
// 							})
// 						}
// 					/>
// 				</View>
// 			</View>
// 		</SafeAreaView>
// 	);
// }
