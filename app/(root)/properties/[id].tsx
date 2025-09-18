// modules
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	Dimensions,
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// lib
import { getAgentById, getPropertyById } from '@/lib/appwrite';
import images from '@/lib/constants/images';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
// components
import AgentContact from '@/components/content/PropertySections/AgentContact';
import Facilities from '@/components/content/PropertySections/Facilities';
import Gallery from '@/components/content/PropertySections/Gallery';
import Intro from '@/components/content/PropertySections/Intro';
import Location from '@/components/content/PropertySections/Location';
import Overview from '@/components/content/PropertySections/Overview';
import Reviews from '@/components/content/PropertySections/Reviews';
import NavigateBack from '@/components/shared/NavigateBack';
import LikeButton from '@/components/ui/LikeButton';
import SendButton from '@/components/ui/SendButton';
import { ROUTES } from '@/lib/constants/paths';
import { featureNotAvailable } from '@/lib/tools';
import CustomTouchable from '@/components/ui/CustomTouchable';
import { TABS_HEIGHT } from '@/lib/constants/layout';

export default function PropertyDetails() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const insets = useSafeAreaInsets();

	const windowHeight = Dimensions.get('window').height;

	const { data: property } = useAppwrite({
		fn: getPropertyById,
		params: {
			id: id!,
		},
	});

	// if (property && typeof property.image[0].image === 'string') {
	// 	property.image = [JSON.parse(property.image[0].image)];
	// }

	const [agent, setAgent] = useState<any>(null);
	const [agentLoading, setAgentLoading] = useState(false);

	useEffect(() => {
		if (!property?.agent) return;

		setAgentLoading(true);
		getAgentById({ id: property.agent })
			.then((res) => setAgent(res))
			.finally(() => setAgentLoading(false));
	}, [property?.agent]);

	// console.log('Property latitude:', property?.latitude);
	// console.log('Property longitude:', property?.longitude);

	return (
		<SafeAreaView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ backgroundColor: 'white', paddingBottom: insets.bottom + TABS_HEIGHT}}
			>
				<View
					className="relative w-full"
					style={{ height: windowHeight / 2 }}
				>
					<Image
						source={{ uri: property?.image[0].image.url }}
						className="size-full"
						resizeMode="cover"
					/>

					<Image
						source={images.whiteGradient}
						className="absolute top-0 w-full z-40"
					/>

					{/* BACK NAVIGATION */}
					<View
						className="z-50 absolute px-5 py-2 bg-white/60"
						style={{
							top: insets.top + 16,
						}}
					>
						<NavigateBack>
							<View className="flex flex-row items-center gap-4">
								<LikeButton onPress={() => featureNotAvailable()} />
								<SendButton onPress={() => featureNotAvailable()} />
							</View>
						</NavigateBack>
					</View>
				</View>

				{/* PROPERTY SECTION */}
				<View className="px-5 my-7 flex gap-2">
					{/* INTRO FIRST INFO SECTION */}
					<Intro property={property} />

					{/* AGENT SECTION */}
					<AgentContact agent={agent} />

					{/* OVERVIEW SECTION */}
					<Overview property={property} />

					{/* FACILITIES SECTION */}
					<Facilities property={property} />

					{/* GALLERY SECTION */}
					<Gallery property={property} />

					{/* LOCATION SECTION */}
					<Location property={property} />

					{/* REVIEWS SECTION */}
					<Reviews property={property} />
				</View>
			</ScrollView>

			{/* BOOK NOW SECTION */}
			<View
				className="absolute flex flex-row items-center bg-[#ffffffea] bottom-0 w-full border-t border-r border-l border-primary-200 px-5"
				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
			>
				<View className="flex flex-row items-center justify-between gap-10 w-full">
					<View className="flex flex-col items-start">
						<Text className="text-black-200 text-xs font-rubik-medium">
							Price
						</Text>
						<Text
							numberOfLines={1}
							className="text-primary-300 text-start text-2xl font-rubik-bold"
						>
							${property?.price}
						</Text>
					</View>

					<CustomTouchable
						title="Book Now"
						onPress={() =>
							router.push({
								pathname: ROUTES.BOOKINGS_ADD_BOOKING,
								params: { id: property?.$id },
							})
						}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}
