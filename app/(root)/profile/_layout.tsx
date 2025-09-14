// modules
import { Slot, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// lib
import { ROUTES } from '@/lib/constants/paths';
// components
import NavigateBack from '@/components/shared/NavigateBack';

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
				{/* BACK NAVIGATION */}
				<NavigateBack title={params.title} path={ROUTES.PROFILE} />
			</View>

			{/* MAIN CONTENT */}
			<Slot />
		</SafeAreaView>
	);
}
