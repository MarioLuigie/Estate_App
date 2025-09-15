// modules
import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// lib
import icons from '@/lib/constants/icons';
import { TABS_HEIGHT } from '@/lib/constants/layout';

const TabIcon = ({
	focused,
	icon,
	title,
}: {
	focused: boolean;
	icon: ImageSourcePropType;
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
	const insets = useSafeAreaInsets()
	return (
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
					bottom: insets.bottom
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} icon={icons.home} title="Home" />
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
	);
}
