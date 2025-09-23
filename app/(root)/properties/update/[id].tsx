// modules
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
// lib
import { getPropertyById } from '@/lib/actions/actions.properties';
import { ActionTypes } from '@/lib/constants/enums';
// components
import PropertyForm from '@/components/forms/PropertyForm';
import EmptyState from '@/components/shared/EmptyState';

export default function UpdateProperty() {
	const { id } = useLocalSearchParams<{ id?: string }>();

	const [property, setProperty] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const normalizedId = Array.isArray(id) ? id[0] : (id ?? '');

	useEffect(() => {
		const fetchProperty = async () => {
			try {
				setLoading(true);
				const res = await getPropertyById({ id: normalizedId });
				setProperty(res);
				setLoading(false);
			} catch (error) {
				console.error('Property not found', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProperty();
	}, [normalizedId]);

	if (loading && !property) {
		return (
			<View className="flex-1 items-center justify-center">
				<EmptyState isLoading={loading} />
			</View>
		);
	}

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
