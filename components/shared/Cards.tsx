// modules
import { Models } from 'react-native-appwrite';
import { Image, Text, TouchableOpacity, View, Dimensions } from 'react-native';
// lib
import icons from '@/lib/constants/icons';
import images from '@/lib/constants/images';
import LikeButton from '../ui/LikeButton';
import { useGlobalContext } from '@/lib/global-provider';
import { getCurrentUser } from '@/lib/actions/appwrite';
import { useAppwrite } from '@/lib/hooks/useAppwrite';

export interface Property extends Models.Document {
	image: { image: { url: string; fileId: string } }[];
	name: string;
	address: string;
	price: number;
	rating: number;
}

interface Props {
	item: Models.Document;
	onPress?: () => void;
}

export function FeaturedCard({ item, onPress }: Props) {
	const { name, price, rating, address, image, $id } =
		item as unknown as Property;

	const { authUser } = useGlobalContext();

	const { data: currentUser } = useAppwrite({
		fn: getCurrentUser,
		params: { authId: authUser!.$id },
	});

	if (!currentUser) {
		return null;
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			className="flex flex-col items-start relative"
			style={{ width: 240, height: 260 }}
		>
			{/* BG IMAGE */}
			<Image
				source={{ uri: image[0].image.url }}
				className="size-full rounded-lg"
			/>
			<Image
				source={images.cardGradient}
				className="size-full rounded-lg absolute bottom-0"
			/>

			{/* RANGE STARS */}
			<View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
				<Image source={icons.star} className="size-3.5" />
				<Text className="text-xs font-rubik-bold text-primary-300 ml-1">
					{rating}
				</Text>
			</View>

			{/* INFOS */}
			<View className="flex flex-col items-start absolute bottom-5 inset-x-5">
				<Text
					className="text-xl font-rubik-extrabold text-white"
					numberOfLines={1}
				>
					{name}
				</Text>
				<Text className="text-base font-rubik text-white" numberOfLines={1}>
					{address}
				</Text>

				<View className="flex flex-row items-center justify-between w-full">
					<Text className="text-xl font-rubik-extrabold text-white">
						${price}
					</Text>
					<LikeButton
						propertyId={$id}
						userId={currentUser!.$id}
						initialCount={0}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export function Card({ item, onPress }: Props) {
	const windowWidth = Dimensions.get('window').width;
	const CARD_MARGIN = 12; // odstęp między kolumnami (ten sam co gap w FlatList)
	const CARD_PADDING = 20; // padding FlatList (np. px-5 → 10px z każdej strony)
	const cardWidth = (windowWidth - CARD_PADDING - CARD_MARGIN) / 2; // 2 kolumny

	const { name, price, rating, address, image, $id } =
		item as unknown as Property;

	const { authUser } = useGlobalContext();

	const { data: currentUser } = useAppwrite({
		fn: getCurrentUser,
		params: { authId: authUser!.$id },
	});

	if (!currentUser) {
		return null;
	}

	return (
		<TouchableOpacity
			className="py-4 px-4 rounded-lg bg-white border border-zinc-300 relative shadow-md"
			onPress={onPress}
			style={{ width: cardWidth, minHeight: 70 }}
		>
			{/* RANGE STARS */}
			<View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
				<Image source={icons.star} className="size-2.5" />
				<Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
					{rating}
				</Text>
			</View>

			{/* BG IMAGE */}
			<Image
				source={{ uri: image[0].image.url }}
				className="w-full h-40 rounded-lg"
			/>

			{/* INFOS */}
			<View className="flex flex-col mt-2 justify-between">
				<View>
					<Text className="text-base font-rubik-bold text-black-300">
						{name}
					</Text>
					<Text
						className="text-xs font-rubik text-black-100"
						numberOfLines={2}
					>
						{address}
					</Text>
				</View>

				<View className="flex flex-row items-center justify-between mt-2">
					<Text className="text-base font-rubik-bold text-primary-300">
						${price}
					</Text>
					<LikeButton
						propertyId={$id}
						userId={currentUser!.$id}
						initialCount={0}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
}
