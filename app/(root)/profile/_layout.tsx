import { Slot, useLocalSearchParams, router } from 'expo-router';
import icons from '@/lib/constants/icons';
import { ROUTES } from '@/lib/constants/paths';
import {
	Text,
	FlatList,
	SafeAreaView,
	View,
	TouchableOpacity,
	Image,
	ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyProfileLayout() {
	const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
	return (
		<SafeAreaView className="flex-1 bg-white">

			{/* HEADER */}
			<View
				className="px-5 py-2 bg-white/60"
				style={{ marginTop: insets.top + 16 }}
			>
				<View className="flex-row items-center justify-between w-full">
					<TouchableOpacity
						onPress={() => router.push(ROUTES.PROFILE)}
						className="flex-row bg-primary-200 rounded-full size-11 items-center justify-center border-[2px] border-zinc-600"
					>
						<Image source={icons.backArrow} className="size-5" />
					</TouchableOpacity>
					<Text className="text-xl font-rubik-bold">
            {params.title}
          </Text> 
				</View>
			</View>

			{/* MAIN CONTENT */}

				<Slot />

		</SafeAreaView>
	);
}
