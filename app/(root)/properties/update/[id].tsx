import PropertyForm from '@/components/forms/PropertyForm';
import { ActionTypes } from '@/lib/constants/enums';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text } from 'react-native';

export default function UpdateProperty() {
	const { id } = useLocalSearchParams();
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 48 }}
			className="flex-1 px-5"
		>
			<Text>UPDATE PROPERTY {id}</Text>
			<PropertyForm actionType={ActionTypes.UPDATE} />
		</ScrollView>
	);
}
