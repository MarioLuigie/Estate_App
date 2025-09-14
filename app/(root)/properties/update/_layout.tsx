// modules
import { Slot } from 'expo-router';
import { SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// components
import NavigateBack from '@/components/shared/NavigateBack';

export default function UpdatePropertyLayout() {
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* HEADER */}
			<View
				className="px-5 py-2 bg-white/60"
				style={{ marginTop: insets.top + 16 }}
			>
				{/* BACK NAVIGATION */}
				<NavigateBack title={'Update Property'} />
			</View>

			{/* MAIN CONTENT */}
			<Slot />
		</SafeAreaView>
	);
}
