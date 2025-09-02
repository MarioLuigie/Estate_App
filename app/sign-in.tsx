import icons from '@/constants/icons';
import images from '@/constants/images';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
	const handleLogin = () => {};

	return (
		<SafeAreaView className="bg-white h-full">
			<ScrollView
				contentContainerStyle={{
					height: '100%',
				}}
			>
				<Image
					source={images.onboarding}
					className="w-full h-4/6"
					resizeMode="contain"
				/>

				<View className="px-10">
					<Text className="text-base text-center uppercase font-rubik text-black-200">
						Welcome To Estate
					</Text>

					<Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
						Dream about {'\n'}
						<Text className="text-primary-300">Your Home</Text>
					</Text>

					<Text className="text-lg font-rubik text-black-200 text-center mt-12">
						Login to Estate with Google
					</Text>

					<TouchableOpacity
						onPress={handleLogin}
						className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
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
