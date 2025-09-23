// modules
import CustomTouchable from '@/components/ui/CustomTouchable';
import { DEFAULT_SUPPORT_EMAIL } from '@/lib/tools/data';
import React, { useState } from 'react';
import {
	ScrollView,
	Text,
	View,
	TouchableOpacity,
	Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HelpCenterSettings() {
	const insets = useSafeAreaInsets();
	const [expandedIndex, setExpandedIndex] = useState(null);

	const faqs = [
		{
			question: 'How to change my password?',
			answer: 'Go to Profile Settings > Change Password.',
		},
		{
			question: 'How to contact support?',
			answer: 'You can email us at demo-support@estate.com or use the chat.',
		},
		{
			question: 'How to cancel a booking?',
			answer: 'Go to My Bookings and select the booking you want to cancel.',
		},
		{
			question: 'How to update payments info?',
			answer: 'Go to Payments Settings and update your card information.',
		},
	];

	const toggleExpand = (index: any) => {
		setExpandedIndex(expandedIndex === index ? null : index);
	};

	const contactSupport = () => {
		Linking.openURL(`mailto:${DEFAULT_SUPPORT_EMAIL}`);
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: insets.bottom, padding: 16 }}
			className="flex-1"
		>
			<Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
				Help Center
			</Text>

			{faqs.map((item, index) => (
				<View key={index} style={{ marginBottom: 12 }}>
					<TouchableOpacity
						onPress={() => toggleExpand(index)}
						style={{
							padding: 12,
							backgroundColor: '#f0f0f0',
							borderRadius: 8,
						}}
					>
						<Text style={{ fontSize: 16, fontWeight: '600' }}>
							{item.question}
						</Text>
					</TouchableOpacity>
					{expandedIndex === index && (
						<View style={{ padding: 12 }}>
							<Text style={{ fontSize: 14, color: '#555' }}>
								{item.answer}
							</Text>
						</View>
					)}
				</View>
			))}

			{/* <TouchableOpacity
				onPress={contactSupport}
				style={{
					marginTop: 24,
					padding: 16,
					backgroundColor: colors.primary[300],
					borderRadius: 8,
					alignItems: 'center',
				}}
			>
				<Text style={{ color: '#fff', fontWeight: 'bold' }}>
					Contact Support
				</Text>
			</TouchableOpacity> */}

			<CustomTouchable
				title="Contact Support"
				onPress={contactSupport}
				className="mt-5"
			/>
		</ScrollView>
	);
}

// // modules
// import React from 'react';
// import { ScrollView, Text } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function HelpCenterSettings() {
// 	const insets = useSafeAreaInsets();

// 	return (
// 		<ScrollView
// 			showsVerticalScrollIndicator={false}
// 			contentContainerStyle={{ paddingBottom: insets.bottom }}
// 			className="flex-1"
// 		>
// 			<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
// 			<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
// 			<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
// 			<Text className="text-9xl">MY BOOKINGS SCREEN</Text>
// 		</ScrollView>
// 	);
// }
