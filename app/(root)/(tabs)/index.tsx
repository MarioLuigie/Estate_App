import icons from '@/constants/icons';
import images from '@/constants/images';
import { SafeAreaView, Text, View, Image } from 'react-native';
import Search from '@/components/Search';

export default function Home() {
	return (
		<SafeAreaView className="h-full bg-white">
			<View className="px-5">
				{/* HEADER */}
				<View className="flex flex-row items-center justify-between mt-16">
					<View className="flex flex-row items-center">
						<View>
							<Image
								source={images.avatar}
								className="size-12 rounded-full"
							/>
						</View>

						<View className="flex flex-col items-start justify-center ml-2">
							<Text className="text-xs font-rubik text-black-100">
								Good Morning
							</Text>
							<Text className="text-base font-rubik-medium text-black-300">
								Mariusz
							</Text>
						</View>
					</View>
					<Image source={icons.bell} className="size-6" />
				</View>
				<Search />
			</View>
		</SafeAreaView>
	);
}

// import { Link } from 'expo-router';
// import { SafeAreaView, StyleSheet, Text } from 'react-native';

// export default function Home() {
// 	return (
// 		<SafeAreaView style={styles.container} className='h-full bg-white'>
// 			<Text className='text-xl my-10 font-rubik-bold'>Home</Text>
// 		</SafeAreaView>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 	},
// });
