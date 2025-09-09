import icons from '@/lib/constants/icons';
import images from '@/lib/constants/images';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Models } from 'react-native-appwrite';

export interface Property extends Models.Document {
	image: string;
	name: string;
	address: string;
	price: number;
	rating: number;
}

interface Props {
	item: Models.Document;
	onPress?: () => void;
}

export default function ComponentName() {
	return (
		<View>
			<Text>Hello React Native</Text>
		</View>
	);
}

export function FeaturedCard({ item, onPress }: Props) {
	const { name, price, rating, address, image } = item as unknown as Property;
	return (
		<TouchableOpacity
			onPress={onPress}
			className="flex flex-col items-start relative"
			style={{width: 240, height: 260}}
		>
			{/* BG IMAGE */}
			<Image source={{ uri: image }} className="size-full rounded-lg" />
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
					<Image source={icons.heart} className="size-5" />
				</View>
			</View>
		</TouchableOpacity>
	);
}

export function Card({ item, onPress }: Props) {
	const { name, price, rating, address, image } = item as unknown as Property;

	return (
		<TouchableOpacity
			className="flex-1 w-full min-h-70 py-4 px-4 rounded-lg bg-white border border-zinc-300 relative shadow-md"
			onPress={onPress}
		>
			{/* RANGE STARS */}
			<View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
				<Image source={icons.star} className="size-2.5" />
				<Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
					{rating}
				</Text>
			</View>

			{/* BG IMAGE */}
			<Image source={{ uri: image }} className="w-full h-40 rounded-lg" />

			{/* INFOS */}
			<View className="flex flex-col mt-2">
				<Text className="text-base font-rubik-bold text-black-300">
					{name}
				</Text>
				<Text className="text-xs font-rubik text-black-100">{address}</Text>

				<View className="flex flex-row items-center justify-between mt-2">
					<Text className="text-base font-rubik-bold text-primary-300">
						${price}
					</Text>
					<Image
						source={icons.heart}
						className="w-5 h-5"
						tintColor="#191D31"
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
}
