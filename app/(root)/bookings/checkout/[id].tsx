import PropertySummary from '@/components/content/properties/PropertySummaryCard';
import CustomTouchable from '@/components/ui/CustomTouchable';
import Paper from '@/components/ui/Paper';
import { getBookingsByPropertyId } from '@/lib/actions/bookings.actions';
import { getPropertyById } from '@/lib/actions/properties.actions';
import { Status } from '@/lib/constants/enums';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import { useBookingsStore } from '@/lib/store/bookings.store';
import { colors } from '@/lib/tools/colors-js';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calculateNights, calculateTotalPrice } from '@/lib/tools';

export default function BookingsCheckoutScreen() {
	const { id } = useLocalSearchParams<{ id?: string }>();
	const [agent, setAgent] = useState<any>(null);
	const [agentLoading, setAgentLoading] = useState(false);
	const insets = useSafeAreaInsets();
	const setDates = useBookingsStore((state) => state.setDates);
	const setProperty = useBookingsStore((state) => state.setProperty);
	const setStatus = useBookingsStore((state) => state.setStatus);
	const { startDate, endDate } = useBookingsStore((state) => state);
	const setTotalPrice = useBookingsStore((state) => state.setTotalPrice);
	const { totalPrice } = useBookingsStore((state) => state);

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
	// useEffect(() => {
	// 	if (!property?.agent) return;

	// 	setAgentLoading(true);
	// 	getAgentById({ id: property.agent })
	// 		.then((res) => setAgent(res))
	// 		.finally(() => setAgentLoading(false));
	// }, [property?.agent]);

	// pobranie rezerwacji i zablokowanie terminów
	useEffect(() => {
		if (!id) return;

		const fetchBookings = async () => {
			const bookings = await getBookingsByPropertyId(id);
			const disabled: Record<string, any> = {};

			bookings!.forEach((b: any) => {
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

			// poprawka: jeśli end < start → zamiana
			const [realStart, realEnd] =
				endDate < startDate ? [endDate, startDate] : [startDate, endDate];

			// WALIDACJA: sprawdź czy w środku są zablokowane dni
			let current = new Date(realStart);
			let invalid = false;

			while (current <= realEnd) {
				const key = current.toISOString().split('T')[0];
				if (blockedDates[key]) {
					invalid = true;
					break;
				}
				current.setDate(current.getDate() + 1);
			}

			if (invalid) {
				// np. reset wyboru i pokaż komunikat
				setSelectedRange({});
				alert(
					'Wybrany zakres zawiera niedostępne dni. Wybierz inny termin.'
				);
				return;
			}

			// ustaw poprawny zakres
			setSelectedRange({
				start: realStart.toISOString().split('T')[0],
				end: realEnd.toISOString().split('T')[0],
			});
		}
	};

	// przelicz cenę przy każdej zmianie zakresu lub ceny nieruchomości
	useEffect(() => {
		if (selectedRange.start && selectedRange.end && property?.price) {
			const newTotal = calculateTotalPrice(
				selectedRange.start,
				selectedRange.end,
				property.price
			);
			setTotalPrice(newTotal);
		} else {
			setTotalPrice(0);
		}
	}, [selectedRange, property?.price, setTotalPrice]);

	// oznaczenia w kalendarzu z pełnym zakresem
	const markedDates: Record<string, any> = {
		...blockedDates,
	};

	if (selectedRange.start) {
		markedDates[selectedRange.start] = {
			startingDay: true,
			color: colors.primary[300],
			textColor: 'white',
		};
	}

	if (selectedRange.end) {
		markedDates[selectedRange.end] = {
			endingDay: true,
			color: colors.primary[300],
			textColor: 'white',
		};

		// oznaczenie dni pomiędzy
		let current = new Date(selectedRange.start!);
		const end = new Date(selectedRange.end);
		current.setDate(current.getDate() + 1); // dzień po starcie

		while (current < end) {
			const key = current.toISOString().split('T')[0];
			markedDates[key] = {
				color: colors.primary[300],
				textColor: 'white',
			};
			current.setDate(current.getDate() + 1);
		}
	}

	const handleCheckout = () => {
		if (!selectedRange.start || !selectedRange.end) {
			alert('Please select a valid date range before proceeding.');
			return;
		}

		// konwersja string → Date
		const startDate = new Date(selectedRange.start);
		const endDate = new Date(selectedRange.end);

		setDates(startDate, endDate);
		setProperty(property.$id);
		setStatus(Status.PENDING);

		router.push(`${ROUTES.BOOKINGS_CHECKOUT_PERSONAL_DATA}/${property.$id}`);
	};

	return (
		<View className="flex-1 relative">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					display: 'flex',
					gap: 7,
					paddingVertical: 7,
				}}
				className="flex-1 bg-white dark:bg-black gap-2"
			>
				<View style={{ marginHorizontal: 12 }}>
					<PropertySummary
						name={property?.name}
						address={property?.address}
						price={property?.price}
						imageUrl={property?.image[0].image.url}
						agent={property?.agent}
					/>
				</View>

				<Paper style={{ marginHorizontal: 12 }}>
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

			{/* BOOK NOW SECTION */}
			<View
				className="flex flex-row items-center bg-[#ffffffea] w-full border-t border-r border-l border-primary-200 px-5"
				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
			>
				<View className="flex flex-row items-center justify-between gap-10 w-full">
					<View className="flex flex-col items-start">
						<Text className="text-black-200 text-xs font-rubik-medium">
							Total Price
						</Text>
						<Text
							numberOfLines={1}
							className="text-primary-300 text-start text-2xl font-rubik-bold"
						>
							${totalPrice}
						</Text>
					</View>

					<View className="flex flex-col items-start">
						<Text className="text-black-200 text-xs font-rubik-medium">
							Nights
						</Text>
						<Text
							numberOfLines={1}
							className="text-primary-300 text-start text-2xl font-rubik-bold"
						>
							{selectedRange.start &&
								selectedRange.end &&
								calculateNights(selectedRange.start, selectedRange.end)}
						</Text>
					</View>

					<CustomTouchable title="Checkout" onPress={handleCheckout} />
				</View>
			</View>
		</View>
	);
}

// const handleDayPress = (day: any) => {
// 	if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
// 		// nowy wybór od początku
// 		setSelectedRange({ start: day.dateString, end: undefined });
// 	} else {
// 		// ustaw koniec zakresu
// 		const startDate = new Date(selectedRange.start);
// 		const endDate = new Date(day.dateString);

// 		if (endDate < startDate) {
// 			// odwrócenie
// 			setSelectedRange({
// 				start: day.dateString,
// 				end: selectedRange.start,
// 			});
// 		} else {
// 			setSelectedRange({
// 				start: selectedRange.start,
// 				end: day.dateString,
// 			});
// 		}
// 	}
// };

// oznaczenia w kalendarzu
// const markedDates = {
// 	...blockedDates,
// 	...(selectedRange.start
// 		? {
// 				[selectedRange.start]: {
// 					startingDay: true,
// 					color: colors.primary[300],
// 					textColor: 'white',
// 				},
// 			}
// 		: {}),
// 	...(selectedRange.end
// 		? {
// 				[selectedRange.end]: {
// 					endingDay: true,
// 					color: colors.primary[300],
// 					textColor: 'white',
// 				},
// 			}
// 		: {}),
// };
