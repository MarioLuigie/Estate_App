import { ActionTypes } from '@/lib/constants/enums';
import React from 'react';
import { View, Text } from 'react-native';

type PropertyFormProps = {
	actionType: ActionTypes;
};

export default function PropertyForm({ actionType }: PropertyFormProps) {
	return (
		<>
			{actionType === ActionTypes.CREATE ? (
				<View>
					<Text>PROPERTY FORM CREATE</Text>
				</View>
			) : (
				<View>
					<Text>PROPERTY FORM UPDATE</Text>
				</View>
			)}
		</>
	);
}


