// modules
import { Redirect } from 'expo-router';
import React from 'react';
import {
	Alert,
	Dimensions,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
// lib
import { login } from '@/lib/actions/actions.sign-in';
import icons from '@/lib/constants/icons';
import images from '@/lib/constants/images';
import { ROUTES } from '@/lib/constants/paths';
import { useGlobalContext } from '@/lib/global-provider';

export default function SignIn() {
	const { isLoggedIn, loading, refetch } = useGlobalContext();
	const insets = useSafeAreaInsets();

	const windowWidth = Dimensions.get('window').width;

	if (!loading && isLoggedIn) return <Redirect href={ROUTES.HOME} />;

	const handleLogin = async () => {
		const result = await login();

		if (result) {
			console.log('Login success');
			refetch();
		} else {
			Alert.alert('Error', 'Failed to login');
		}
	};

	return (
		<SafeAreaView className="bg-white h-full">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					flexGrow: 1,
					paddingTop: 14,
					paddingBottom: insets.bottom,
				}}
			>
				<Image
					source={images.onboarding}
					style={{
						width: windowWidth,
						height: windowWidth * 1.2,
					}}
					resizeMode="contain"
				/>

				<View className="px-10 mt-4">
					<Text className="text-base text-center uppercase font-rubik text-black-200">
						Welcome To
					</Text>

					<Text className="text-6xl font-rubik-medium text-black-300 text-center mt-2 pb-5">
						Estate
					</Text>

					<Text className="text-lg font-rubik text-black-200 text-center mt-1">
						Login to Estate with Google
					</Text>

					<TouchableOpacity
						onPress={handleLogin}
						className="bg-white border border-zinc-300 shadow-md shadow-zinc-00 rounded-full w-full py-4 mt-4"
					>
						<View className="flex flex-row items-center justify-center">
							<Image
								source={icons.google}
								className="w-5 h-5"
								resizeMode="contain"
							/>
							<Text className="text-lg font-rubik-medium text-black-300 ml-2">
								Continue with Google
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 	},
// });
