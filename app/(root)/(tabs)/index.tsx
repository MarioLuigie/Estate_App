import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function Home() {
	return (
		<SafeAreaView style={styles.container} className='h-full bg-white'>
			<Text className='text-xl my-10 font-rubik-bold'>Home</Text>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

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
