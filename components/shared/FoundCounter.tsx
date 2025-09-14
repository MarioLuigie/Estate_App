import React from 'react';
import { Text } from 'react-native';

export default function FoundCounter({
	listTitle,
	data,
}: {
	listTitle: string;
	data: any[] | null;
}) {
	return (
		<Text className="text-xl font-rubik-medium text-black-300">
			Found {data?.length} {listTitle}
		</Text>
	);
}
