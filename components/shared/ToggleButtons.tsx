// modules
import { Text, TouchableOpacity, View } from 'react-native';

type ToggleButtonsProps = {
	value: boolean;
	onChange: (val: boolean) => void;
	primaryLabel: string;
	secondaryLabel: string;
};

export default function ToggleButtons({ value, onChange, primaryLabel, secondaryLabel }: ToggleButtonsProps) {
	return (
		<View className="flex flex-row bg-mygrey-200 rounded-xl p-1">
			<TouchableOpacity
				onPress={() => onChange(false)}
				className={`flex-1 py-2 rounded-xl ${!value ? 'bg-primary-300' : ''}`}
			>
				<Text
					className={`text-center ${!value ? 'text-white' : 'text-black-300'}`}
				>
					{primaryLabel}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => onChange(true)}
				className={`flex-1 py-2 rounded-xl ${value ? 'bg-primary-300' : ''}`}
			>
				<Text
					className={`text-center ${value ? 'text-white' : 'text-black-300'}`}
				>
					{secondaryLabel}
				</Text>
			</TouchableOpacity>
		</View>
	);
}
