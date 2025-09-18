import PropertySummary from '@/components/content/PropertySummary';
import CustomTouchable from '@/components/ui/CustomTouchable';
import Paper from '@/components/ui/Paper';
import {
	getAgentById,
	getPropertyById,
	getBookingsByPropertyId,
} from '@/lib/appwrite';
import { ROUTES } from '@/lib/constants/paths';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddBooking() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const [agent, setAgent] = useState<any>(null);
	const [agentLoading, setAgentLoading] = useState(false);
	const insets = useSafeAreaInsets();

	const { data: property } = useAppwrite({
		fn: getPropertyById,
		params: { id: id! },
	});

	const [blockedDates, setBlockedDates] = useState<Record<string, any>>({});
	const [selectedRange, setSelectedRange] = useState<{
		start?: string;
		end?: string;
	}>({});

	// pobranie agenta
	useEffect(() => {
		if (!property?.agent) return;

		setAgentLoading(true);
		getAgentById({ id: property.agent })
			.then((res) => setAgent(res))
			.finally(() => setAgentLoading(false));
	}, [property?.agent]);

	// pobranie rezerwacji i zablokowanie terminów
	useEffect(() => {
		if (!id) return;

		const fetchBookings = async () => {
			const bookings = await getBookingsByPropertyId(id);
			const disabled: Record<string, any> = {};

			bookings.forEach((b: any) => {
				let current = new Date(b.startDate);
				const end = new Date(b.endDate);

				while (current <= end) {
					const key = current.toISOString().split('T')[0];
					disabled[key] = { disabled: true, disableTouchEvent: true };
					current.setDate(current.getDate() + 1);
				}
			});

			setBlockedDates(disabled);
		};

		fetchBookings();
	}, [id]);

	// wybór terminu
	const handleDayPress = (day: any) => {
		if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
			// nowy wybór od początku
			setSelectedRange({ start: day.dateString, end: undefined });
		} else {
			// ustaw koniec zakresu
			const startDate = new Date(selectedRange.start);
			const endDate = new Date(day.dateString);

			if (endDate < startDate) {
				// odwrócenie
				setSelectedRange({
					start: day.dateString,
					end: selectedRange.start,
				});
			} else {
				setSelectedRange({
					start: selectedRange.start,
					end: day.dateString,
				});
			}
		}
	};

	// oznaczenia w kalendarzu
	const markedDates = {
		...blockedDates,
		...(selectedRange.start
			? {
					[selectedRange.start]: {
						startingDay: true,
						color: '#000',
						textColor: 'white',
					},
				}
			: {}),
		...(selectedRange.end
			? {
					[selectedRange.end]: {
						endingDay: true,
						color: '#000',
						textColor: 'white',
					},
				}
			: {}),
	};

	return (
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: insets.bottom }}
				className="pt-3 flex-1 bg-white dark:bg-black"
			>
				<PropertySummary
					name={property?.name}
					address={property?.address}
					price={property?.price}
					imageUrl={property?.image[0].image.url}
					agent={agent}
				/>

				<Paper>
					<Text className="text-black-300 text-xl font-rubik-bold dark:text-white mb-2">
						Select a Date
					</Text>
					<Calendar
						onDayPress={handleDayPress}
						markingType={'period'}
						markedDates={markedDates}
						theme={{
							selectedDayBackgroundColor: '#000',
							selectedDayTextColor: '#fff',
							todayTextColor: '#000',
							arrowColor: '#000',
						}}
					/>
				</Paper>
			</ScrollView>

			

	);
}

// import PropertySummary from '@/components/content/PropertySummary';
// import { getAgentById, getPropertyById } from '@/lib/appwrite';
// import { useAppwrite } from '@/lib/hooks/useAppwrite';
// import { useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { View } from 'react-native';

// export default function AddBooking() {
// 	const { id } = useLocalSearchParams<{ id?: string }>();
// 	const [agent, setAgent] = useState<any>(null);
// 	const [agentLoading, setAgentLoading] = useState(false);

// 	const { data: property } = useAppwrite({
// 		fn: getPropertyById,
// 		params: { id: id! },
// 	});

// 	useEffect(() => {
// 		if (!property?.agent) return;

// 		setAgentLoading(true);
// 		getAgentById({ id: property.agent })
// 			.then((res) => setAgent(res))
// 			.finally(() => setAgentLoading(false));
// 	}, [property?.agent]);

// 	return (
// 		<View className="pt-3">
// 			<PropertySummary
// 				name={property?.name}
// 				address={property?.address}
// 				price={property?.price}
// 				imageUrl={property?.image[0].image.url}
// 				agent={agent}
// 			/>
// 		</View>
// 	);
// }
