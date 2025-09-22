// modules
import { FlatList, View, TouchableOpacity, FlatListProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// lib
import { TABS_HEIGHT } from '@/lib/constants/layout';
// components
import EmptyState from '@/components/shared/EmptyState';
import FoundCounter from '@/components/shared/FoundCounter';

interface CustomFlatListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
	data: T[] | null;
	cols?: number;
	renderItem: (item: T, isSingleCol: boolean) => React.ReactElement | null;
	isLoading: boolean;
}

export function CustomFlatList<T>({
	data,
	cols = 2,
	renderItem,
	isLoading,
	...rest
}: CustomFlatListProps<T>) {
	const [isGrid, setIsGrid] = useState(false); // true = list, false = grid
	const insets = useSafeAreaInsets();

	return (
		<View className="flex-1">
			<View className="flex flex-row justify-between items-center py-2">
				<FoundCounter data={data} listTitle="Published Properties" />
				{/* Toggle */}
				<TouchableOpacity onPress={() => setIsGrid((prev) => !prev)}>
					<MaterialIcons
						name={isGrid ? 'view-list' : 'view-column'}
						size={36}
						color="#BDBDBD"
					/>
				</TouchableOpacity>
			</View>

			{/* Lista */}
			<FlatList
				key={isGrid ? 'grid' : 'list'}
				data={data ?? []}
				renderItem={({ item }) => renderItem(item, isGrid)}
				keyExtractor={(item, index) =>
					(item as any)?.$id ?? index.toString()
				}
				{...(isGrid && {
					numColumns: cols,
					columnWrapperClassName: 'flex gap-3',
				})}
				contentContainerStyle={{
					paddingBottom: insets.bottom + TABS_HEIGHT,
					display: 'flex',
					flexDirection: 'column',
				}}
				ListEmptyComponent={<EmptyState isLoading={isLoading} />}
				showsVerticalScrollIndicator={false}
				{...rest}
			/>
		</View>
	);
}
