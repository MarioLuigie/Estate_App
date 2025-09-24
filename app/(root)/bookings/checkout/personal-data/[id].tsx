import PersonalDataForm from '@/components/forms/PersonalDataForm';
import CustomTouchable from '@/components/ui/CustomTouchable';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { useGlobalContext } from '@/lib/context/global-provider';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import { useBookingsStore } from '@/lib/store/bookings.store';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalData() {
  const { id } = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const { startDate, endDate, property, status } = useBookingsStore((state) => state);

	const { authUser } = useGlobalContext();
	const { data: user } = useAppwrite({
		fn: () => getCurrentUser({ authId: authUser!.$id }),
	});

	const profile = {
		id: user?.$id ?? '',
		fullName: user?.fullName ?? '',
		email: user?.email ?? '',
		phone: user?.phone ?? '',
	};

	console.log('PERSONAL DATA', startDate, endDate, property, status);

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
					<PersonalDataForm profile={profile} />
				</View>
			</ScrollView>

			{/* BOOK NOW SECTION */}
			<View
				className="flex flex-row items-center bg-[#ffffffea] w-full border-t border-r border-l border-primary-200 px-5"
				style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
			>
				<View className="flex flex-row items-center justify-between gap-10 w-full">
					<CustomTouchable
						title="Continue"
						onPress={() =>
							router.push(`${ROUTES.BOOKINGS_CHECKOUT_PAYMENT_METHOD}/${id}`)
						}
					/>
				</View>
			</View>
		</View>
	);
}
