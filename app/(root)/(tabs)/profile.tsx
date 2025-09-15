// modules
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
import { router } from 'expo-router';
// lib
import { logout } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import icons from '@/lib/constants/icons';
import { settings } from '@/lib/constants/data';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import LogoutModal from '@/components/content/modals/LogoutModal';

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
	const { user, refetch } = useGlobalContext();
	const insets = useSafeAreaInsets();

	const handleLogout = async () => {
		const result = await logout();
		if (result) {
			Alert.alert('Success', 'Logged out successfully');
			refetch();
		} else {
			Alert.alert('Error', 'Failed to logout');
		}
	};

	return (
		<SafeAreaView className="h-full bg-white">
			{/* PROFILE INFO */}
			<View className="px-5 mb-4">
				<View className="flex flex-row items-center justify-between mt-16">
					<Text className="text-xl font-rubik-bold">Profile</Text>
					<Image source={icons.bell} className="size-7" />
				</View>

				<View className="flex flex-row justify-center">
					<View className="flex flex-col items-center relative">
						<Image
							source={{ uri: user?.avatar }}
							className="size-44 relative rounded-full"
						/>
						<TouchableOpacity className="absolute bottom-11 right-2">
							<Image source={icons.edit} className="size-9" />
						</TouchableOpacity>

						<Text className="text-2xl font-rubik-bold mt-3">
							{user?.name}
						</Text>
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
				<View className="flex flex-col mt-4">
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
				<View className="flex flex-col border-t py-5 border-primary-200">
					<SettingsItem
						icon={icons.logout}
						title="Logout"
						textStyle="text-danger"
						showArrow={false}
						onPress={() => setLogoutVisible(true)}
					/>
				</View>
			</ScrollView>

			<LogoutModal
				visible={logoutVisible}
				onClose={() => setLogoutVisible(false)}
			/>
		</SafeAreaView>
	);
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
