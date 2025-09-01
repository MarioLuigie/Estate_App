import { Link } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function Index() {
	return (
		<View style={styles.container}>
			<Link href='/sign-in'>Sign In</Link>
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
