import PropertyForm from '@/components/forms/PropertyForm';
import { ActionTypes } from '@/lib/constants/enums';
import React from 'react';
import { ScrollView, Text } from 'react-native';

export default function AddProperty() {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 48 }}
			className="flex-1 px-5"
		>
			<Text>ADD PROPERTY</Text>

      <PropertyForm actionType={ActionTypes.CREATE}/>
		</ScrollView>
	);
}
