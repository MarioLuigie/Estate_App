// modules
import PropertyMarker from '@/components/shared/PropertyMarker';
import { customMapStyles } from '@/lib/tools/colorsJS';
import icons from '@/lib/constants/icons';
import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';

type LocationProps = {
	property: any;
};

export default function Location({ property }: LocationProps) {
	return (
		<>
			<View className="mt-7">
				<Text className="text-black-300 text-xl font-rubik-bold">
					Location
				</Text>
				<View className="flex flex-row items-center justify-start mt-4 gap-2">
					<Image source={icons.location} className="w-7 h-7" />
					<Text className="text-black-200 text-sm font-rubik-medium pr-5">
						{property?.address}
					</Text>
				</View>
			</View>

			{property?.latitude != null && property?.longitude != null ? (
				<View style={{ borderRadius: 12, overflow: 'hidden' }}>
					<MapView
						style={{ width: '100%', height: 300, borderRadius: 60 }}
						initialRegion={{
							latitude: property.latitude,
							longitude: property.longitude,
							latitudeDelta: 0.1,
							longitudeDelta: 0.1,
						}}
						customMapStyle={customMapStyles}
					>
						<PropertyMarker
							settings={{
								latitude: property.latitude,
								longitude: property.longitude,
								image: property.image[0].image.url,
							}}
						/>
					</MapView>
				</View>
			) : (
				<ActivityIndicator
					size="large"
					color="#007aff"
					style={{ height: 300 }}
				/>
			)}
		</>
	);
}
