// modules
import { colors } from '@/lib/colorsJS';
import React, { useState } from 'react';
import {
	ScrollView,
	Text,
	View,
	Switch,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsSettings() {
	const insets = useSafeAreaInsets();

	const [generalNotifications, setGeneralNotifications] = useState(true);
	const [agentNotifications, setAgentNotifications] = useState(true);
	const [doNotDisturb, setDoNotDisturb] = useState(false);

	const setDoNotDisturbNow = () => {
		// tutaj możesz dodać logikę np. ustawienia timerów dla DND
		Alert.alert('Do Not Disturb enabled for 1 hour');
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: insets.bottom, padding: 16 }}
			className="flex-1"
		>
			<Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
				Notifications Settings
			</Text>

			{/* General Notifications */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<Text style={{ fontSize: 16 }}>General Notifications</Text>
				<Switch
					value={generalNotifications}
					onValueChange={setGeneralNotifications}
					trackColor={{ false: '#9e9e9e', true: colors.primary[250] }}
					thumbColor={
						generalNotifications ? colors.primary[300] : '#dddddd'
					}
				/>
			</View>

			{/* Agent Notifications */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<Text style={{ fontSize: 16 }}>Notifications from Agents</Text>
				<Switch
					value={agentNotifications}
					onValueChange={setAgentNotifications}
					trackColor={{ false: '#9e9e9e', true: colors.primary[250] }}
					thumbColor={agentNotifications ? colors.primary[300] : '#dddddd'}
				/>
			</View>

			{/* Do Not Disturb */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<Text style={{ fontSize: 16 }}>Do Not Disturb</Text>
				<Switch
					value={doNotDisturb}
					onValueChange={(value) => {
						setDoNotDisturb(value);
						if (value) setDoNotDisturbNow();
					}}
					trackColor={{ false: '#9e9e9e', true: colors.primary[250] }}
					thumbColor={doNotDisturb ? colors.primary[300] : '#dddddd'}
				/>
			</View>

			{/* Opcjonalnie: przyciski dodatkowe np. ustawienia czasu DND */}
			<TouchableOpacity
				onPress={() => Alert.alert('Set schedule')}
				style={{
					padding: 16,
					backgroundColor: '#f0f0f0',
					borderRadius: 40,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<Text style={{ fontWeight: 'bold' }}>Set DND Schedule</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

// // modules
// import React from 'react';
// import { ScrollView, Text } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function NotificationsSettings() {
//     const insets = useSafeAreaInsets();
//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
// 			contentContainerStyle={{ paddingBottom: insets.bottom }}
//       className="flex-1"
//     >
//       <Text className="text-9xl">TEST NOTIFICATIONS SETTINGS</Text>
//       <Text className="text-9xl">TEST NOTIFICATIONS SETTINGS</Text>
//       <Text className="text-9xl">TEST NOTIFICATIONS SETTINGS</Text>
//     </ScrollView>
//   );
// }
