// modules
import { router } from 'expo-router';
import { useState } from 'react';
import {
	Alert,
	Image,
	ImageSourcePropType,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// lib
import { logout } from '@/lib/actions/appwrite';
import { settings } from '@/lib/constants/data';
import icons from '@/lib/constants/icons';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { useGlobalContext } from '@/lib/global-provider';
// components
import CustomModal from '@/components/shared/CustomModal';
import NotifBellButton from '@/components/ui/NotifBellButton';
import { featureNotAvailable } from '@/lib/tools';

interface SettingsItemProp {
	icon: ImageSourcePropType;
	title: string;
	onPress?: () => void;
	textStyle?: string;
	showArrow?: boolean;
}

const SettingsItem = ({
	icon,
	title,
	onPress,
	textStyle,
	showArrow = true,
}: SettingsItemProp) => (
	<TouchableOpacity
		onPress={onPress}
		className="flex flex-row items-center justify-between py-3"
	>
		<View className="flex flex-row items-center gap-3">
			<Image source={icon} className="size-6" />
			<Text
				className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}
			>
				{title}
			</Text>
		</View>

		{showArrow && <Image source={icons.rightArrow} className="size-5" />}
	</TouchableOpacity>
);

export default function Profile() {
	const [logoutVisible, setLogoutVisible] = useState<boolean>(false);
	const { authUser, refetch } = useGlobalContext();
	const insets = useSafeAreaInsets();

	const handleLogout = async () => {
		try {
			await logout();
			refetch();
			setLogoutVisible(false);
			router.replace(ROUTES.SIGN_IN);
		} catch (error) {
			Alert.alert(`User not logged out. ${error}`);
			setLogoutVisible(false);
		}
	};

	return (
		<SafeAreaView className="h-full bg-white">
			{/* PROFILE INFO */}
			<View className="px-5 mb-4">
				<View className="flex flex-row items-center justify-between mt-16">
					<Text className="text-xl font-rubik-bold">Profile</Text>
					<NotifBellButton onPress={() => featureNotAvailable()} />
				</View>

				<View className="flex flex-row justify-center">
					<View className="flex flex-col items-center">
						<View className="relative">
							<Image
								source={{ uri: authUser?.avatar }}
								className="size-44 rounded-full"
							/>
							<TouchableOpacity
								className="absolute bottom-0 right-0"
								onPress={() => featureNotAvailable()}
							>
								<Image source={icons.edit} className="size-9" />
							</TouchableOpacity>
						</View>
						<View className='mt-3 flex items-center'>
							<Text className="text-2xl font-rubik-bold">
								{authUser?.name}
							</Text>
							<Text className="text-md font-rubik-light">
								{authUser?.email}
							</Text>
						</View>
					</View>
				</View>
			</View>

			{/* BUTTONS LIST */}
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerClassName="px-7"
				contentContainerStyle={{
					paddingBottom: insets.bottom + TABS_HEIGHT,
				}}
			>
				<View className="flex flex-col">
					<SettingsItem
						icon={icons.calendar}
						title="My Bookings"
						onPress={() =>
							router.push({
								pathname: ROUTES.PROFILE_MY_BOOKINGS,
								params: { title: 'My Bookings' },
							})
						}
					/>
					<SettingsItem
						icon={icons.calendar}
						title="My Properties"
						onPress={() =>
							router.push({
								pathname: ROUTES.PROFILE_MY_PROPERTIES,
								params: { title: 'My Properties' },
							})
						}
					/>
				</View>

				<View className="flex flex-col my-5 border-t pt-5 border-primary-200">
					{settings.slice(2).map((item, index) => (
						<SettingsItem
							key={index}
							title={item.title}
							icon={item.icon}
							onPress={() =>
								router.push({
									pathname: item.path,
									params: { title: item.title },
								})
							}
						/>
					))}
				</View>

				{/* LOGOUT */}
				<View className="border-t py-5 border-primary-200">
					<SettingsItem
						icon={icons.logout}
						title="Logout"
						textStyle="text-danger"
						showArrow={false}
						onPress={() => setLogoutVisible(true)}
					/>
				</View>
			</ScrollView>

			{/* LOGOUT MODAL */}
			<CustomModal
				visible={logoutVisible}
				title="Confirm Logout"
				message="Are you sure you want to logout?"
				onConfirm={handleLogout}
				onCancel={() => setLogoutVisible(false)}
			/>
		</SafeAreaView>
	);
}
