// modules
import { router, useLocalSearchParams } from 'expo-router';
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
import { useEffect, useState } from 'react';
// lib
import images from '@/lib/constants/images';
import { getAgentById, getPropertyById } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
// components
import NavigateBack from '@/components/shared/NavigateBack';
import { featureNotAvailable } from '@/lib/tools';
import LikeButton from '@/components/ui/LikeButton';
import SendButton from '@/components/ui/SendButton';
import AgentContact from '@/components/content/PropertySections/Agent';
import Intro from '@/components/content/PropertySections/Intro';
import Overview from '@/components/content/PropertySections/Overview';
import Facilities from '@/components/content/PropertySections/Facilities';
import Gallery from '@/components/content/PropertySections/Gallery';
import Location from '@/components/content/PropertySections/Location';
import Reviews from '@/components/content/PropertySections/Reviews';
import { ROUTES } from '@/lib/constants/paths';

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
				contentContainerClassName="pb-48 bg-white"
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
				<View className="px-5 mt-7 flex gap-2">
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
				className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 px-7 py-7"
				style={{ paddingBottom: insets.bottom + 10 }}
			>
				<View className="flex flex-row items-center justify-between gap-10">
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

					<TouchableOpacity
						onPress={() => router.push({
							pathname: ROUTES.BOOKINGS_ADD_BOOKING,
							params: { id: property?.$id}
						})}
						className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
					>
						<Text className="text-white text-lg text-center font-rubik-bold">
							Book Now
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}
