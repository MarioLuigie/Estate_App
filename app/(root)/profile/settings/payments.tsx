// modules
import CustomTouchable from '@/components/ui/CustomTouchable';
import React, { useState } from 'react';
import {
	ScrollView,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentsSettings() {
	const insets = useSafeAreaInsets();

	const [cards, setCards] = useState([
		{
			id: 1,
			cardNumber: '**** **** **** 1234',
			expiry: '12/25',
			isDefault: true,
		},
		{
			id: 2,
			cardNumber: '**** **** **** 5678',
			expiry: '05/24',
			isDefault: false,
		},
	]);

	const [newCardNumber, setNewCardNumber] = useState('');
	const [newExpiry, setNewExpiry] = useState('');

	const addCard = () => {
		if (!newCardNumber || !newExpiry) {
			Alert.alert('Please fill in all fields');
			return;
		}
		const newCard = {
			id: Date.now(),
			cardNumber: `**** **** **** ${newCardNumber.slice(-4)}`,
			expiry: newExpiry,
			isDefault: false,
		};
		setCards([...cards, newCard]);
		setNewCardNumber('');
		setNewExpiry('');
	};

	const removeCard = (id: number) => {
		setCards(cards.filter((card) => card.id !== id));
	};

	const setDefaultCard = (id: number) => {
		setCards(cards.map((card) => ({ ...card, isDefault: card.id === id })));
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: insets.bottom, padding: 16 }}
			className="flex-1"
		>
			<Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
				Payment Methods
			</Text>

			{/* Lista kart */}
			{cards.map((card) => (
				<View
					key={card.id}
					style={{
						padding: 16,
						backgroundColor: '#f0f0f0',
						borderRadius: 8,
						marginBottom: 12,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<View>
						<Text style={{ fontSize: 16 }}>{card.cardNumber}</Text>
						<Text style={{ fontSize: 14, color: '#555' }}>
							Expiry: {card.expiry}
						</Text>
						{card.isDefault && (
							<Text style={{ fontSize: 12, color: '#16a34a' }}>
								Default
							</Text>
						)}
					</View>

					<View style={{ flexDirection: 'row' }}>
						{!card.isDefault && (
							<TouchableOpacity
								onPress={() => setDefaultCard(card.id)}
								style={{ marginRight: 12 }}
							>
								<Text style={{ color: '#4ade80', fontWeight: 'bold' }}>
									Set Default
								</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity onPress={() => removeCard(card.id)}>
							<Text style={{ color: '#ef4444', fontWeight: 'bold' }}>
								Remove
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			))}

			{/* Dodawanie nowej karty */}
			<View style={{ marginTop: 24 }}>
				<Text
					style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}
				>
					Add New Card
				</Text>
				<TextInput
					placeholder="Card Number"
					value={newCardNumber}
					onChangeText={setNewCardNumber}
					keyboardType="numeric"
					style={{
						borderWidth: 1,
						borderColor: '#ccc',
						borderRadius: 40,
						padding: 10,
						marginBottom: 12,
					}}
				/>
				<TextInput
					placeholder="Expiry MM/YY"
					value={newExpiry}
					onChangeText={setNewExpiry}
					style={{
						borderWidth: 1,
						borderColor: '#ccc',
						borderRadius: 40,
						padding: 10,
						marginBottom: 12,
					}}
				/>
				{/* <TouchableOpacity
					onPress={addCard}
					style={{
						padding: 16,
						backgroundColor: colors.primary[300],
						borderRadius: 8,
						alignItems: 'center',
					}}
				>
					<Text style={{ color: '#fff', fontWeight: 'bold' }}>
						Add Card
					</Text>
				</TouchableOpacity> */}
              <CustomTouchable
                title="Add Card"
                onPress={addCard}
                className="mt-5"
              />
			</View>
		</ScrollView>
	);
}

// // modules
// import React from 'react';
// import { ScrollView, Text } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function PaymentsSettings() {
//     const insets = useSafeAreaInsets();
//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
// 			contentContainerStyle={{ paddingBottom: insets.bottom }}

//       className="flex-1"
//     >
//       <Text className="text-9xl">TEST PAYMENTS SETTINGS</Text>
//       <Text className="text-9xl">TEST PAYMENTS SETTINGS</Text>
//       <Text className="text-9xl">TEST PAYMENTS SETTINGS</Text>
//     </ScrollView>
//   );
// }
