import { Slot } from 'expo-router';
import { ROUTES } from '@/lib/constants/paths';
import { SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigateBack from '@/components/shared/NavigateBack';

export default function AddPropertyLayout() {
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* HEADER */}
			<View
				className="px-5 py-2 bg-white/60"
				style={{ marginTop: insets.top + 16 }}
			>
				{/* BACK NAVIGATION */}
				<NavigateBack title='Add New Property' path={ROUTES.PROFILE_MY_PROPERTIES} />
			</View>

			{/* MAIN CONTENT */}
			<Slot />
		</SafeAreaView>
	);
}
