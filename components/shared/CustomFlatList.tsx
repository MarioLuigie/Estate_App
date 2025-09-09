import { FlatList, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import EmptyState from './EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FoundCounter from '@/components/shared/FoundCounter';

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

	return (
		<View className="flex-1">
      
			<View className='flex flex-row justify-between items-center'>
        <FoundCounter data={data} listTitle='Properties'/>
				{/* Toggle */}
				<TouchableOpacity
					onPress={() => setIsGrid((prev) => !prev)}
				>
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
				}}
				ListEmptyComponent={<EmptyState isLoading={isLoading} />}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
