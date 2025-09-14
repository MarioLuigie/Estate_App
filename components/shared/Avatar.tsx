// modules
import React from 'react';
import { View, Image } from 'react-native';

export default function Avatar({ avatar }: { avatar: string | undefined }) {
	return (
		<View>
			<Image
				source={{ uri: avatar }}
				className="size-12 rounded-full"
			/>
		</View>
	);
}
