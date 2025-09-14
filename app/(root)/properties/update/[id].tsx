// modules
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
// lib
import { getPropertyById } from '@/lib/appwrite';
import { ActionTypes } from '@/lib/constants/enums';
// components
import PropertyForm from '@/components/forms/PropertyForm';

export default function UpdateProperty() {
	const { id } = useLocalSearchParams<{ id?: string }>();

	const [property, setProperty] = useState<any>(null);
	const normalizedId = Array.isArray(id) ? id[0] : (id ?? '');

	useEffect(() => {
		const fetchProperty = async () => {
			try {
				const res = await getPropertyById({ id: normalizedId });
				if (res && typeof res.image === 'string') res.image = JSON.parse(res.image);
				setProperty(res);
			} catch (error) {
				console.error('Property not found', error);
			}
		};

		fetchProperty();
	}, [normalizedId]);

	if (!property) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text>Property not found</Text>
			</View>
		);
	}

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 48 }}
			className="flex-1 px-5"
		>
			<PropertyForm actionType={ActionTypes.UPDATE} property={property} />
		</ScrollView>
	);
}
