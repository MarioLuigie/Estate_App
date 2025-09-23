// modules
import CustomTouchable from '@/components/ui/CustomTouchable';
import { colors } from '@/lib/tools/colorsJS';
import React, { useState } from 'react';
import {
	ScrollView,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Alert,
	Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SecuritySettings() {
	const insets = useSafeAreaInsets();

	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [enable2FA, setEnable2FA] = useState(false);
	const [useBiometrics, setUseBiometrics] = useState(false);

	const changePassword = () => {
		if (!currentPassword || !newPassword) {
			Alert.alert('Please fill in all password fields');
			return;
		}
		// tutaj dodaj logikę zmiany hasła w backendzie
		Alert.alert('Password changed successfully!');
		setCurrentPassword('');
		setNewPassword('');
	};

	const logoutAllDevices = () => {
		// tutaj logika wylogowania wszystkich sesji
		Alert.alert('Logged out from all devices!');
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: insets.bottom, padding: 16 }}
			className="flex-1"
		>
			<Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
				Security Settings
			</Text>

			{/* Change Password */}
			<View style={{ marginBottom: 24 }}>
				<Text
					style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}
				>
					Change Password
				</Text>
				<TextInput
					placeholder="Current Password"
					value={currentPassword}
					onChangeText={setCurrentPassword}
					secureTextEntry
					style={{
						borderWidth: 1,
						borderColor: '#ccc',
						borderRadius: 40,
						padding: 10,
						marginBottom: 12,
					}}
				/>
				<TextInput
					placeholder="New Password"
					value={newPassword}
					onChangeText={setNewPassword}
					secureTextEntry
					style={{
						borderWidth: 1,
						borderColor: '#ccc',
						borderRadius: 40,
						padding: 10,
						marginBottom: 12,
					}}
				/>
				{/* <TouchableOpacity
					onPress={changePassword}
					style={{
						padding: 16,
						backgroundColor: '#4ade80',
						borderRadius: 8,
						alignItems: 'center',
					}}
				>
					<Text style={{ color: '#fff', fontWeight: 'bold' }}>
						Change Password
					</Text>
				</TouchableOpacity> */}
				<CustomTouchable
					title="Change Password"
					onPress={changePassword}
					className="mt-5"
				/>
			</View>

			{/* Two-Factor Authentication */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<Text style={{ fontSize: 16 }}>
					Two-Factor Authentication (2FA)
				</Text>
				<Switch
					value={enable2FA}
					onValueChange={setEnable2FA}
					trackColor={{ false: '#9e9e9e', true: colors.primary[250] }}
					thumbColor={enable2FA ? colors.primary[300] : '#dddddd'}
				/>
			</View>

			{/* Biometric Login */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<Text style={{ fontSize: 16 }}>
					Use Biometrics (Face ID / Touch ID)
				</Text>
				<Switch
					value={useBiometrics}
					onValueChange={setUseBiometrics}
					trackColor={{ false: '#9e9e9e', true: colors.primary[250] }}
					thumbColor={useBiometrics ? colors.primary[300] : '#dddddd'}
				/>
			</View>

			{/* Logout from all devices */}
			<TouchableOpacity
				onPress={logoutAllDevices}
				style={{
					padding: 16,
					backgroundColor: '#ef4444',
					borderRadius: 40,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<Text style={{ color: '#fff', fontWeight: 'bold' }}>
					Logout from All Devices
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

// // modules
// import React from 'react';
// import { ScrollView, Text } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function SecuritySettings() {
//     const insets = useSafeAreaInsets();
//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
// 			contentContainerStyle={{ paddingBottom: insets.bottom }}

//       className="flex-1"
//     >
//       <Text className="text-9xl">TEST SECURITY SETTINGS</Text>
//       <Text className="text-9xl">TEST SECURITY SETTINGS</Text>
//       <Text className="text-9xl">TEST SECURITY SETTINGS</Text>
//     </ScrollView>
//   );
// }
