import { Tabs, useRouter } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '@/lib/constants/icons';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import IconButton from '@/components/ui/IconButton';
import { MaterialIcons } from '@expo/vector-icons';

const TabIcon = ({
	focused,
	icon,
	title,
}: {
	focused: boolean;
	icon: any;
	title: string;
}) => (
	<View className="flex-1 mt-4 flex flex-col items-center">
		<Image
			source={icon}
			tintColor={focused ? '#0061FF' : '#666876'}
			resizeMode="contain"
			className="size-6"
		/>
		<Text
			className={`${
				focused
					? 'text-primary-300 font-rubik-medium'
					: 'text-black-200 font-rubik'
			} text-xs w-full text-center`}
		>
			{title}
		</Text>
	</View>
);

export default function TabsLayout() {
	const insets = useSafeAreaInsets();
	const router = useRouter();

	return (
		<View style={{ flex: 1 }}>
			{/* Tabs */}
			<Tabs
				screenOptions={{
					tabBarShowLabel: false,
					tabBarStyle: {
						backgroundColor: 'white',
						opacity: 0.9,
						position: 'absolute',
						borderTopColor: '#0061FF1A',
						borderTopWidth: 1,
						height: TABS_HEIGHT,
						bottom: insets.bottom,
					},
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: 'Home',
						headerShown: false,
						tabBarIcon: ({ focused }) => (
							<TabIcon
								focused={focused}
								icon={icons.home}
								title="Home"
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="explore"
					options={{
						title: 'Explore',
						headerShown: false,
						tabBarIcon: ({ focused }) => (
							<TabIcon
								focused={focused}
								icon={icons.search}
								title="Explore"
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: 'Profile',
						headerShown: false,
						tabBarIcon: ({ focused }) => (
							<TabIcon
								focused={focused}
								icon={icons.person}
								title="Profile"
							/>
						),
					}}
				/>
			</Tabs>

			{/* FAB */}
			<IconButton
				icon={<MaterialIcons name="add" size={24} color="white" />}
				onPress={() =>
					router.push({ pathname: ROUTES.PROPERTIES_ADD_PROPERTY })
				}
				containerStyle={{
					position: 'absolute',
					bottom: TABS_HEIGHT + 60, // trochę nad tabbarem
					right: 20,
					alignSelf: 'center',
					backgroundColor: 'rgb(0, 97, 255)',
					borderRadius: 40,
					width: 64,
					height: 64,
					justifyContent: 'center',
					alignItems: 'center',
					elevation: 5, // cień na Androidzie
					shadowColor: '#000', // cień na iOS
					shadowOpacity: 0.2,
					shadowOffset: { width: 0, height: 2 },
					shadowRadius: 4,
				}}
				activeOpacity={0.7}
			/>
		</View>
	);
}
