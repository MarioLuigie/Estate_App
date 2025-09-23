// modules
import React, { useState } from 'react';
import {
	ScrollView,
	Text,
	View,
	TextInput,
	Image,
	TouchableOpacity,
	Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import CustomTouchable from '@/components/ui/CustomTouchable';

export default function ProfileSettings() {
	const insets = useSafeAreaInsets();

	// stan użytkownika
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [avatar, setAvatar] = useState('');
	const [birthDate, setBirthDate] = useState('');
	const [bio, setBio] = useState('');

	// funkcja do wyboru avatara
	const pickImage = async () => {
		if (Platform.OS !== 'web') {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
				alert('Permission to access media library is required!');
				return;
			}
		}
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});
		if (!result.canceled) {
			setAvatar(result.assets[0].uri);
		}
	};

	const handleSave = () => {
		// Tutaj możesz dodać logikę wysyłania danych do backendu
		console.log({ name, email, avatar, birthDate, bio });
		alert('Profile saved!');
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: insets.bottom, padding: 16 }}
			className="flex-1"
		>
			<View className="items-center mb-6">
				<TouchableOpacity onPress={pickImage}>
					{avatar ? (
						<Image
							source={{ uri: avatar }}
							style={{ width: 100, height: 100, borderRadius: 50 }}
						/>
					) : (
						<View
							style={{
								width: 150,
								height: 150,
								borderRadius: 75,
								backgroundColor: '#ccc',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Text>Add Avatar</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>

			<View className="mb-4">
				<Text className="mb-1">Name</Text>
				<TextInput
					placeholder="Enter your name"
					value={name}
					onChangeText={setName}
					style={{
						borderWidth: 1,
						borderColor: 'gray',
						borderRadius: 40,
						padding: 10,
					}}
				/>
			</View>

			<View className="mb-4">
				<Text className="mb-1">Email</Text>
				<TextInput
					placeholder="Enter your email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					style={{
						borderWidth: 1,
						borderColor: 'gray',
						borderRadius: 40,
						padding: 10,
					}}
				/>
			</View>

			<View className="mb-4">
				<Text className="mb-1">Date of Birth</Text>
				<TextInput
					placeholder="YYYY-MM-DD"
					value={birthDate}
					onChangeText={setBirthDate}
					style={{
						borderWidth: 1,
						borderColor: 'gray',
						borderRadius: 40,
						padding: 10,
					}}
				/>
			</View>

			<View className="mb-4">
				<Text className="mb-1">Bio</Text>
				<TextInput
					placeholder="Tell something about yourself"
					value={bio}
					onChangeText={setBio}
					multiline
					numberOfLines={3}
					style={{
						borderWidth: 1,
						borderColor: 'gray',
						borderRadius: 20,
						padding: 10,
						textAlignVertical: 'top',
					}}
				/>
			</View>

			<CustomTouchable
				title="Save Profile"
				onPress={handleSave}
				className="mt-5"
			/>
		</ScrollView>
	);
}

// // modules
// import React from 'react';
// import { ScrollView, Text, View } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function ProfileSettings() {
// 		const insets = useSafeAreaInsets();
// 	return (
// 		<ScrollView
// 			showsVerticalScrollIndicator={false}
// 			contentContainerStyle={{ paddingBottom: insets.bottom }}

// 			className="flex-1"
// 		>
// 			<Text className="text-9xl">TEST PROFILE SETTINGS</Text>
// 			<Text className="text-9xl">TEST PROFILE SETTINGS</Text>
// 			<Text className="text-9xl">TEST PROFILE SETTINGS</Text>
// 		</ScrollView>
// 	);
// }
