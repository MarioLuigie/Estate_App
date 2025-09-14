// modules
import React from 'react';
import { ScrollView } from 'react-native';
// lib
import { ActionTypes } from '@/lib/constants/enums';
// components
import PropertyForm from '@/components/forms/PropertyForm';

export default function AddProperty() {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 48 }}
			className="flex-1 px-5"
		>
      <PropertyForm actionType={ActionTypes.CREATE}/>
		</ScrollView>
	);
}
