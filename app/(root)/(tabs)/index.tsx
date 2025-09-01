import { Link } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';

export default function Index() {
	return (
		<View style={styles.container}>
			<Text className='text-6xl text-orange-500'>WELCOME!!!</Text>
			<Link href='/sign-in'>Sign</Link>
			<Link href='/explore'>Explore</Link>
			<Link href='/profile'>Profile</Link>
			<Link href='/properties/1'>Properties</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
