// modules
import { Redirect, Slot } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// lib
import { ROUTES } from '@/lib/constants/paths';
import { useGlobalContext } from '@/lib/context/global-provider';

export default function AppLayout() {
	const { loading, isLoggedIn } = useGlobalContext();

	if (loading) {
		return (
			<SafeAreaView className="bg-white h-full flex justify-center items-center">
				<ActivityIndicator className="text-primary-300" size="large" />
			</SafeAreaView>
		);
	}

	if (!isLoggedIn) {
		return <Redirect href={ROUTES.SIGN_IN} />;
	}

	return <Slot />;
}
