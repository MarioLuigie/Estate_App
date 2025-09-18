import PropertySummary from '@/components/content/PropertySummary';
import { getAgentById, getPropertyById } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function AddBooking() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const [agent, setAgent] = useState<any>(null);
	const [agentLoading, setAgentLoading] = useState(false);

	const { data: property } = useAppwrite({
		fn: getPropertyById,
		params: { id: id! },
	});

	useEffect(() => {
		if (!property?.agent) return;

		setAgentLoading(true);
		getAgentById({ id: property.agent })
			.then((res) => setAgent(res))
			.finally(() => setAgentLoading(false));
	}, [property?.agent]);

	return (
		<View className="pt-3">
			<PropertySummary
				name={property?.name}
				address={property?.address}
				price={property?.price}
				imageUrl={property?.image[0].image.url}
				agent={agent}
			/>
		</View>
	);
}
