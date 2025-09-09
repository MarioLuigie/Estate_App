import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileSettings() {
		const insets = useSafeAreaInsets();
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: insets.bottom }}

			className="flex-1"
		>
			<Text className="text-9xl">TEST PROFILE SETTINGS</Text>
			<Text className="text-9xl">TEST PROFILE SETTINGS</Text>
			<Text className="text-9xl">TEST PROFILE SETTINGS</Text>
		</ScrollView>
	);
}


