// modules
import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';

type GalleryProps = {
	property: any;
};

export default function Gallery({ property }: GalleryProps) {
	return (
		<>
			{property?.gallery?.length > 0 && (
				<View className="mt-7">
					<Text className="text-black-300 text-xl font-rubik-bold">
						Gallery
					</Text>
					<FlatList
						contentContainerStyle={{ paddingRight: 20 }}
						keyExtractor={(item) => item.$id}
						horizontal
						showsHorizontalScrollIndicator={false}
						data={property?.gallery}
						renderItem={({ item }) => (
							<Image
								source={{ uri: item.image.url }}
								className="size-56 rounded-xl"
							/>
						)}
						contentContainerClassName="flex gap-4 mt-3"
					/>
				</View>
			)}
		</>
	);
}
