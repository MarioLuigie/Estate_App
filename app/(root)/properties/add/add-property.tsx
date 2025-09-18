// modules
import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// lib
import { ActionTypes } from '@/lib/constants/enums';
// components
import PropertyForm from '@/components/forms/PropertyForm';

export default function AddProperty() {
	const insets = useSafeAreaInsets();
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: insets.bottom }}
			className="flex-1 px-5"
		>
      <PropertyForm actionType={ActionTypes.CREATE}/>
		</ScrollView>
	);
}
