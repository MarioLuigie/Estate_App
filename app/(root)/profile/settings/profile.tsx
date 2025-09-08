import React from 'react';
import { ScrollView, Text } from 'react-native';

export default function ProfileSettings() {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 48 }}
			className="flex-1"
		>
			<Text className="text-9xl">TEST PROFILE SETTINGS</Text>
			<Text className="text-9xl">TEST PROFILE SETTINGS</Text>
			<Text className="text-9xl">TEST PROFILE SETTINGS</Text>
		</ScrollView>
	);
}


