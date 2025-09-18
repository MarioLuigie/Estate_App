import React from 'react';
import { View } from 'react-native';

export default function Paper({ children }: { children: React.ReactNode }) {
	return (
		<View className="mx-4 p-4 flex flex-col border border-zinc-200 bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden">
			{children}
		</View>
	);
}
