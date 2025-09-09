import { FlatList, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import EmptyState from './EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomListProps {
	data: any[] | null;
	cols?: number;
	renderItem: (item: any, isSingleCol: boolean) => React.ReactElement | null;
	isLoading: boolean;
}

export function CustomFlatList({
	data,
	cols = 2,
	renderItem,
	isLoading,
}: CustomListProps) {
	const [isGrid, setIsGrid] = useState(false); // true = list, false = grid
	const insets = useSafeAreaInsets();

  console.log("IS GRID FROM CustomFlatList:", isGrid)

	return (
		<View className="flex-1">
			{/* Toggle */}
			<TouchableOpacity
				className="flex flex-row justify-end my-2"
				onPress={() => setIsGrid((prev) => !prev)}
			>
				<MaterialIcons
					name={isGrid ? 'view-list' : 'view-column'}
					size={36}
					color="#BDBDBD"
				/>
			</TouchableOpacity>

			{/* Lista */}
			<FlatList
				key={isGrid? 'grid' : 'list'}
				data={data}
				renderItem={({ item }) => renderItem(item, isGrid)}
				keyExtractor={(item) => item.$id}
				{...(isGrid && {
					numColumns: cols,
					columnWrapperClassName: 'flex gap-3',
				})}
				contentContainerStyle={{
					paddingBottom: insets.bottom,
					display: 'flex',
					flexDirection: 'column',
					gap: 6,
				}}
				ListEmptyComponent={<EmptyState isLoading={isLoading} />}
        showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
