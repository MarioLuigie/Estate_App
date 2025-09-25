import PersonalDataForm from '@/components/forms/PersonalDataForm';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { useGlobalContext } from '@/lib/context/global-provider';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import { useBookingsStore } from '@/lib/store/bookings.store';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalDataScreen() {
	const { id } = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const { startDate, endDate, property, status, totalPrice } =
		useBookingsStore((state) => state);

	console.log(
		'PERSONAL DATA PD',
		startDate,
		endDate,
		property,
		status,
		totalPrice
	);

	const { authUser } = useGlobalContext();
	const { data: user } = useAppwrite({
		fn: () => getCurrentUser({ authId: authUser!.$id }),
	});

	const profile = {
		fullName: user?.fullName ?? '',
		email: user?.email ?? '',
		phone: user?.phone ?? '',
	};

	const handleRedirectUser = () => {
		router.push(`${ROUTES.BOOKINGS_CHECKOUT_PAYMENT_METHOD}/${id}`);
	};

	return (
		<View className="flex-1 relative">
			<Text className="font-rubik-medium text-black text-xl mt-5 px-5">
				Confirm personal data
			</Text>
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
					<PersonalDataForm
						profile={profile}
						redirectUser={handleRedirectUser}
					/>
				</View>
			</ScrollView>

			{/* BOOK NOW SECTION */}
			<View
				className="flex flex-row items-center bg-[#ffffffea] w-full border-t border-r border-l border-primary-200 px-5"
				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
			>
				<View className="flex flex-row items-center justify-between gap-10 w-full"></View>
			</View>
		</View>
	);
}
