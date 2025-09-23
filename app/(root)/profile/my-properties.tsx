// modules
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
// lib
import {
	deleteAllPropertiesAtomic,
	getMyProperties,
} from '@/lib/actions/actions.properties';
import { ROUTES } from '@/lib/constants/paths';
import { useGlobalContext } from '@/lib/context/global-provider';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
// components
import PropertyCard from '@/components/content/properties/PropertyCard';
import { CustomFlatList } from '@/components/shared/CustomFlatList';
import CustomModal from '@/components/shared/CustomModal';
import ToggleButtons from '@/components/shared/ToggleButtons';
import CustomTouchable from '@/components/ui/CustomTouchable';

export default function MyPropertiesScreen() {
	const { authUser } = useGlobalContext();
	const [cardDeleted, setCardDeleted] = useState<boolean>(false);
	const [deleteAllVisible, setDeleteAllVisible] = useState<boolean>(false);
	const [deleteSummary, setDeleteSummary] = useState<boolean>(false);
	const [deleteSuccessed, setDeleteSuccessed] = useState<number>(0);
	const [deleteFailed, setDeleteFailed] = useState<number>(0);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [isSold, setIsSold] = useState<boolean>(false);

	const {
		data: properties,
		loading: propertiesLoading,
		refetch,
	} = useAppwrite({
		fn: getMyProperties,
		params: { userId: authUser?.$id ?? '' },
	});

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await refetch({ userId: authUser?.$id! });
		setRefreshing(false);
	}, [authUser?.$id, refetch]);

	useEffect(() => {
		if (authUser?.$id) {
			refetch({ userId: authUser.$id });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardDeleted, authUser?.$id]);

	const handleDeleteAll = async () => {
		setCardDeleted(false);
		const results = await deleteAllPropertiesAtomic(
			properties!.map((p) => {
				return { id: p.$id, imageId: p.image[0].image.fileId };
			})
		);

		if (results) {
			setCardDeleted(true);

			const successed = results.filter((r) => {
				return r.success === true;
			});

			const failed = results.filter((r) => {
				return r.success === false;
			});
			setDeleteSuccessed(Number(successed.length));
			setDeleteFailed(Number(failed.length));

			setDeleteAllVisible(true);

			setTimeout(() => {
				setDeleteSummary(true);
			}, 500);

			console.log(successed.length);
			console.log(failed.length);
		}
	};

	return (
		<View className="flex-1 bg-white px-5 py-4">
			<View className="mb-8">
				{/* Select properties or sold properties */}
				<ToggleButtons
					value={isSold}
					onChange={() => setIsSold((prev) => !prev)}
					primaryLabel="Published"
					secondaryLabel="Sold"
				/>
			</View>

			{!isSold ? (
				<>
					<View className="flex flex-row items-center gap-3 mb-4">
						{/* Remove all properties button */}
						<CustomTouchable
							title="Remove All"
							onPress={() => setDeleteAllVisible(true)}
							containerStyle={{ backgroundColor: '#eee' }}
							textStyle={{ color: '#7a7a7a' }}
							className="flex-1"
						/>
						{/* Add property button */}
						<CustomTouchable
							title="Add New"
							onPress={() =>
								router.push({
									pathname: ROUTES.PROPERTIES_ADD_PROPERTY,
								})
							}
							icon={<MaterialIcons name="add" size={24} color="white" />}
							className="flex-1"
						/>
					</View>

					<CustomFlatList
						data={properties}
						isLoading={propertiesLoading}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
							/>
						}
						renderItem={(item, isGrid) => (
							<PropertyCard
								property={item}
								onPress={() => {
									router.push(`${ROUTES.PROPERTIES}/${item?.$id}`);
								}}
								isGrid={isGrid}
								setCardDeleted={setCardDeleted}
							/>
						)}
					/>
				</>
			) : (
				<View></View>
			)}

			<CustomModal
				visible={deleteAllVisible}
				title="Confirm Delete All Items"
				message="Are you sure you want to delete all?"
				actionMessage="Property is deleting now."
				onConfirm={handleDeleteAll}
				onCancel={() => setDeleteAllVisible(false)}
				isChecked
			/>

			<CustomModal
				visible={deleteSummary}
				title="Deletion Summary"
				message={
					<View style={Styles.textContainer}>
						<View style={Styles.text}>
							<MaterialIcons
								name="check-circle"
								size={20}
								color="green"
								style={{ marginRight: 6 }}
							/>
							<Text>Deletions completed: {deleteSuccessed}</Text>
						</View>
						<View style={Styles.text}>
							{!(deleteFailed === 0) ? (
								<MaterialIcons
									name="cancel"
									size={20}
									color="red"
									style={{ marginRight: 6 }}
								/>
							) : (
								<MaterialIcons
									name="check-circle"
									size={20}
									color="green"
									style={{ marginRight: 6 }}
								/>
							)}
							<Text>Deletions unsuccessful: {deleteFailed}</Text>
						</View>
					</View>
				}
				onCancel={() => setDeleteSummary(false)}
			/>
		</View>
	);
}

const Styles = StyleSheet.create({
	textContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: 6,
	},
	text: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
});
