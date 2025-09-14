// modules
import { View, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
// lib
import { colors } from '@/lib/colorsJS';

export default function PropertyMarker({
	settings,
	onPress,
	...props
}: {
	settings: { latitude: number; longitude: number; image?: string };
	onPress?: () => void;
}) {
	return (
		<Marker
			coordinate={{
				latitude: settings?.latitude,
				longitude: settings?.longitude,
			}}
			tracksViewChanges={true}
			onPress={onPress}
			{...props}
		>
			{/* Custom marker */}
			<View style={styles.markerContainer}>
				<View style={styles.imageWrapper}>
					{settings.image ? (
						<Image
							source={{ uri: settings.image }}
							style={styles.markerImage}
						/>
					) : (
						<View className='w-[50px] h-[50px] bg-primary-300 rounded-full'></View>
					)}
				</View>

				{/* Igła markera */}
				<View style={styles.needle} />
			</View>
		</Marker>
	);
}

const styles = StyleSheet.create({
	markerContainer: {
		alignItems: 'center',
	},
	imageWrapper: {
		width: 60,
		height: 60,
		borderRadius: 30,
		overflow: 'hidden',
		borderWidth: 3,
		borderColor: colors.primary[300],
		// backgroundColor: colors.primary[300],
		backgroundColor: '#fff',
		elevation: 5, // Android shadow
		shadowColor: '#000', // iOS shadow
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	markerImage: {
		width: '100%',
		height: '100%',
	},
	needle: {
		width: 0,
		height: 0,
		borderLeftWidth: 8,
		borderRightWidth: 8,
		borderTopWidth: 12,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: colors.primary[300],
		marginTop: -2,
	},
	callout: {
		backgroundColor: 'white',
		padding: 8,
		borderRadius: 8,
		width: 150,
		alignItems: 'center',
	},
});
