// modules
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type CheckboxProps = {
	checked: boolean;
	onChange: (newValue: boolean) => void;
};

export default function Checkbox({ checked, onChange }: CheckboxProps) {
	return (
		<TouchableOpacity
			style={[styles.box, checked && styles.boxChecked]}
			onPress={() => onChange(!checked)}
		>
			{checked && <MaterialIcons name="check" size={20} color="white" />}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	box: {
		width: 24,
		height: 24,
		borderWidth: 2,
		borderColor: '#333',
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
	},
	boxChecked: {
		backgroundColor: 'black',
		borderColor: 'black',
	},
});
