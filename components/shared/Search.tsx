// modules
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';
// lib
import icons from '@/lib/constants/icons';
import { featureNotAvailable } from '@/lib/tools';

export default function Search() {
	const path = usePathname();
	const params = useLocalSearchParams<{ query?: string }>();

	const [search, setSearch] = useState<string | undefined>(params.query);

	const debounceSearch = useDebouncedCallback((text: string) => {
		router.setParams({ query: text });
	}, 500);

	const handleSearch = (text: string) => {
		setSearch(text);
		debounceSearch(text);
	};

	return (
		<View className="flex flex-row items-center justify-between w-full px-4 py-2 rounded-lg bg-accent-100 border border-primary-100">
			<View className="flex-1 flex flex-row items-center justify-start z-50">
				<Image source={icons.search} className="size-5" />
				<TextInput
					value={search}
					onChangeText={handleSearch}
					placeholder="Search for anything"
					className="text-sm font-rubik text-black-300 ml-2 flex-1"
				/>
			</View>

			<TouchableOpacity onPress={() => featureNotAvailable("Filters")}>
				<Image source={icons.filter} className="size-5" />
			</TouchableOpacity>
		</View>
	);
}
