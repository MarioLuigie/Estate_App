import { ActionTypes } from '@/lib/constants/enums';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PropertyFormProps = {
	actionType: ActionTypes;
};

export default function PropertyForm({ actionType }: PropertyFormProps) {
	return (
		<>
			{actionType === ActionTypes.CREATE ? (
				<View style={styles.container}>
					<Text>PROPERTY FORM CREATE</Text>
				</View>
			) : (
				<View style={styles.container}>
					<Text>PROPERTY FORM UPDATE</Text>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
