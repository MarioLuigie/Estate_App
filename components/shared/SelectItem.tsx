import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	Modal,
	Image,
} from 'react-native';
import icons from '@/lib/constants/icons';

export interface SelectOption {
	id: string; // np. $id agenta
	label: string; // np. name
	subLabel?: string; // np. email
	avatar?: string; // opcjonalna ikona
}

interface SelectProps {
	options: SelectOption[];
	value?: string; // aktualnie wybrany id
	onChange: (id: string) => void;
	placeholder?: string;
	label?: string;
}

export default function Select({
	options,
	value,
	onChange,
	placeholder,
	label,
}: SelectProps) {
	const [open, setOpen] = useState(false);

	const selected = options.find((o) => o.id === value);

	return (
		<View className="mb-3">
			{label && <Text className="mb-1">{label}</Text>}

			<TouchableOpacity
				className="border border-gray-500 px-4 py-2.5 rounded flex-row items-center justify-between"
				onPress={() => setOpen(true)}
				style={{ borderRadius: 40 }}
			>
				{/* Jeśli jest wybrany agent */}
				{selected ? (
					<View className="flex-row items-center flex-1">
						{selected.avatar ? (
							<Image
								source={{ uri: selected.avatar }}
								className="w-8 h-8 rounded-full mr-2"
							/>
						) : (
							<Image
								source={icons.person}
								className="w-8 h-8 rounded-full mr-2"
							/>
						)}
						<Text className="font-bold">{selected.label}</Text>
					</View>
				) : (
					<Text className="text-gray-500 flex-1">
						{placeholder || 'Select...'}
					</Text>
				)}

				<Image source={icons.downArrow} className="w-4 h-4 ml-2" />
			</TouchableOpacity>

			<Modal visible={open} transparent animationType="slide">
				<View className="flex-1 bg-black/40 justify-center">
					<View className="bg-white mx-4 rounded-xl p-4 max-h-96">
						<FlatList
							data={options}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<TouchableOpacity
									className="flex-row items-center py-2 px-2"
									onPress={() => {
										onChange(item.id);
										setOpen(false);
									}}
								>
									{item.avatar ? (
										<Image
											source={{ uri: item.avatar }}
											className="w-10 h-10 rounded-full mr-3"
										/>
									) : (
										<Image
											source={icons.person}
											className="w-10 h-10 rounded-full mr-3"
										/>
									)}
									<View>
										<Text className="font-bold">{item.label}</Text>
										{item.subLabel && (
											<Text className="text-gray-500">
												{item.subLabel}
											</Text>
										)}
									</View>
								</TouchableOpacity>
							)}
						/>

						<TouchableOpacity
							className="mt-4 bg-gray-200 py-2 rounded"
							onPress={() => setOpen(false)}
						>
							<Text className="text-center">Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}

// import React, { useState } from 'react';
// import {
// 	View,
// 	Text,
// 	TouchableOpacity,
// 	FlatList,
// 	Modal,
// 	Image,
// } from 'react-native';
// import icons from '@/lib/constants/icons';

// export interface SelectOption {
// 	id: string; // np. $id agenta
// 	label: string; // np. name
// 	subLabel?: string; // np. email
// 	avatar?: string; // opcjonalna ikona
// }

// interface SelectProps {
// 	options: SelectOption[];
// 	value?: string; // aktualnie wybrany id
// 	onChange: (id: string) => void;
// 	placeholder?: string;
// 	label?: string;
// }

// export default function Select({
// 	options,
// 	value,
// 	onChange,
// 	placeholder,
// 	label,
// }: SelectProps) {
// 	const [open, setOpen] = useState(false);

// 	const selected = options.find((o) => o.id === value);

// 	return (
// 		<View className="mb-3">
// 			{label && <Text className="mb-1">{label}</Text>}

// 			<TouchableOpacity
// 				className="border border-gray-400 px-4 py-4 rounded flex-row items-center justify-between"
// 				onPress={() => setOpen(true)}
// 				style={{ borderRadius: 40 }}
// 			>
// 				<Text>
// 					{selected ? selected.label : placeholder || 'Select...'}
// 				</Text>
// 				<Image source={icons.downArrow} className="w-4 h-4" />
// 			</TouchableOpacity>

// 			<Modal visible={open} transparent animationType="slide">
// 				<View className="flex-1 bg-black/40 justify-center">
// 					<View className="bg-white mx-4 rounded-xl p-4 max-h-96">
// 						<FlatList
// 							data={options}
// 							keyExtractor={(item) => item.id}
// 							renderItem={({ item }) => (
// 								<TouchableOpacity
// 									className="flex-row items-center py-2 px-2"
// 									onPress={() => {
// 										onChange(item.id);
// 										setOpen(false);
// 									}}
// 								>
// 									{item.avatar ? (
// 										<Image
// 											source={{ uri: item.avatar }}
// 											className="w-10 h-10 rounded-full mr-3"
// 										/>
// 									) : (
// 										<Image
// 											source={icons.person}
// 											className="w-10 h-10 rounded-full mr-3"
// 										/>
// 									)}
// 									<View>
// 										<Text className="font-bold">{item.label}</Text>
// 										{item.subLabel && (
// 											<Text className="text-gray-500">
// 												{item.subLabel}
// 											</Text>
// 										)}
// 									</View>
// 								</TouchableOpacity>
// 							)}
// 						/>

// 						<TouchableOpacity
// 							className="mt-4 bg-gray-200 py-2 rounded"
// 							onPress={() => setOpen(false)}
// 						>
// 							<Text className="text-center">Cancel</Text>
// 						</TouchableOpacity>
// 					</View>
// 				</View>
// 			</Modal>
// 		</View>
// 	);
// }
