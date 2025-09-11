import { ActionTypes } from '@/lib/constants/enums';
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	Platform,
	Alert,
	Linking,
	// FlatList,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import {
	createProperty,
	getAddressFromCoordinates,
	getAgents,
	addImageToStorage,
} from '@/lib/appwrite';
// import { COLLECTIONS, config } from "@/lib/constants/data";
import { PropertyFormValues, PropertyFormSchema } from '@/lib/utils/validators';
import { useGlobalContext } from '@/lib/global-provider';
import { PropertyDefaultValues, facilities, types } from '@/lib/constants/data';
import Select, { SelectOption } from '@/components/shared/SelectItem';
import icons from '@/lib/constants/icons';

type PropertyFormProps = {
	actionType: ActionTypes;
};

export default function PropertyForm({ actionType }: PropertyFormProps) {
	const { user } = useGlobalContext();
	const [agents, setAgents] = useState<any[]>([]);
	const [isError, setIsError] = useState<boolean>(false);
	const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<PropertyFormValues>({
		resolver: zodResolver(PropertyFormSchema),
		defaultValues: PropertyDefaultValues,
	});

	const [submitting, setSubmitting] = useState(false);
	const image = watch('image');
	const facilitiesSelected = watch('facilities');
	const typeSelected = watch('type');
	// const rating = watch('rating');
	// const coords = {
	// 	latitude: watch('latitude'),
	// 	longitude: watch('longitude'),
	// };

	useEffect(() => {
		const fetchAgents = async () => {
			try {
				const res = await getAgents();
				setAgents(res ?? []);

				if (res?.length === 0) setIsError(true);
			} catch (error) {
				console.error('Failed to fetch agents:', error);
				setIsError(true);
				//add state for displaying issue on UI
			}
		};

		fetchAgents();
	}, []);

	const agentsOptions: SelectOption[] = agents.map((a) => ({
		id: a.$id,
		label: a.name,
		subLabel: a.email,
		avatar: a.avatar,
	}));

	// --- Toggle facility ---
	const toggleFacility = (name: string) => {
		const current = facilitiesSelected || [];
		if (current.includes(name)) {
			setValue(
				'facilities',
				current.filter((f) => f !== name)
			);
		} else {
			setValue('facilities', [...current, name]);
		}
	};

	// --- Select type ---
	const selectType = (type: string) => {
		if (typeSelected === type) {
			setValue('type', '');
		}

		setValue('type', type);
	};

	const addAddressAuto = async (coords: {
		longitude: number;
		latitude: number;
	}) => {
		const address = await getAddressFromCoordinates(
			coords.latitude,
			coords.longitude
		);

		const fullAddress = `${address?.street}, ${address?.city}, ${address?.country}`;

		// setAddressState(address!);
		setValue('address', fullAddress); // <-- to uzupełnia input w formularzu
	};

	const pickImage = async () => {
		try {
			// Check for the permission
			if (Platform.OS !== 'web') {
				// Ask for the permission if it is mobile platform
				console.log('PERMISSION STATUS:', status);

				if (status?.status !== 'granted') {
					const responsePermission = await requestPermission();

					console.log('RESPONSE PERMISSION:', responsePermission);
					if (responsePermission.status !== 'granted') {
						Alert.alert(
							'Permission not granted',
							'You need to grant photo library permission to select an image',
							[
								{ text: 'Cancel' },
								{
									text: 'Open Settings',
									onPress: () => {
										if (Platform.OS === 'ios') {
											Linking.openURL('app-settings:');
										} else {
											Linking.openSettings();
										}
									},
								},
							]
						);
						return;
					}
				}
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				allowsMultipleSelection: false, // only one image
				quality: 1,
			});

			if (result.canceled) return;

			const asset = result.assets[0];

			const getFileExtension = (asset: any) => {
				const name =
					asset.fileName ?? asset.uri.split('/').pop() ?? 'photo.jpg';
				const extMatch = name.match(/\.(\w+)$/);
				return extMatch ? extMatch[1].toLowerCase() : 'jpg';
			};

			const ext = getFileExtension(asset);

			const file = {
				uri: asset.uri,
				name: `photo-${Date.now()}.${ext}`,
				type: asset.type ?? asset.mimeType ?? `image/${ext}`,
				size: asset.fileSize ?? 0,
			};

			const uploaded = await addImageToStorage(file);

			if (uploaded) {
				setValue('image', uploaded.url); // set url in form
			}
		} catch (error) {
			console.error('Image picker error:', error);
		}
	};

		// --- Submit ---
	const onSubmit = async (data: PropertyFormValues) => {
		setSubmitting(true);
		try {
			if (!user) return;

			console.log('DATA:', data);
			const createdProperty = await createProperty(data);

			if (createdProperty) reset();

			console.log('Property added:', createdProperty);
		} catch (err) {
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			{actionType === ActionTypes.CREATE ? (
				<View className="py-4 bg-white">
					{/* Name */}
					<Controller
						control={control}
						name="name"
						render={({ field: { onChange, value } }) => (
							<View className="mb-3">
								<Text>Name</Text>
								<TextInput
									style={{
										borderWidth: 1,
										borderColor: 'gray',
										paddingHorizontal: 12,
										paddingVertical: 8,
										borderRadius: 40,
										marginVertical: 4,
									}}
									value={value}
									onChangeText={onChange}
									placeholder="Property Name"
								/>
								{errors.name && (
									<Text className="text-red-500">
										{errors.name.message}
									</Text>
								)}
							</View>
						)}
					/>

					{/* Upload Image */}
					<View className="mb-3">
						<TouchableOpacity
							className="bg-blue-500 p-6 rounded-3xl flex justify-center items-center"
							onPress={pickImage}
						>
							<Image
								source={icons.upload_w}
								style={{
									width: 90,
									height: 90,
								}}
							/>
							<Text className="text-white text-center">
								Add Main Image
							</Text>
						</TouchableOpacity>
						{image ? (
							<View className="flex flex-row gap-2">
								<Image
									source={{ uri: image }}
									style={{
										width: 120,
										height: 120,
										borderRadius: 8,
										marginBottom: 8,
									}}
								/>
							</View>
						) : null}
					</View>

					{/* Agents */}
					<Controller
						control={control}
						name="agent"
						render={({ field }) => (
							<Select
								label="Agent"
								placeholder="Select Agent"
								options={agentsOptions}
								value={field.value}
								onChange={field.onChange}
								isError={isError}
							/>
						)}
					/>

					{/* Type */}
					<Controller
						control={control}
						name="type"
						render={({ field: { onChange, value } }) => (
							<View className="mb-3">
								<Text>Type</Text>
								<TextInput
									editable={false}
									style={{
										borderWidth: 1,
										borderColor: 'gray',
										paddingHorizontal: 12,
										paddingVertical: 8,
										borderRadius: 40,
										marginVertical: 4,
										color: '#000',
									}}
									value={value}
									onChangeText={onChange}
									placeholder="House, Condo..."
								/>
								{errors.type && (
									<Text className="text-red-500">
										{errors.type.message}
									</Text>
								)}
							</View>
						)}
					/>

					{/* Type */}
					<Text className="mb-2 font-bold">Type</Text>
					<View className="flex flex-row flex-wrap mb-3">
						{types.map((t) => (
							<TouchableOpacity
								key={t.title}
								className={`flex flex-row gap-2 items-center px-4 py-2 border border-mygrey-300 rounded-full mr-2 mb-4 ${
									typeSelected === t.type
										? 'bg-blue-400'
										: 'bg-gray-200'
								}`}
								onPress={() => selectType(t.type)}
							>
								<Text
									className={`${typeSelected === t.type ? 'text-white' : 'text-black'}`}
								>
									{t.title}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Description */}
					<Controller
						control={control}
						name="description"
						render={({ field: { onChange, value } }) => (
							<View className="mb-3">
								<Text>Description</Text>
								<TextInput
									multiline
									numberOfLines={4}
									style={{
										borderWidth: 1,
										borderColor: 'gray',
										paddingHorizontal: 12,
										paddingVertical: 8,
										borderRadius: 20,
										marginVertical: 4,
									}}
									value={value}
									onChangeText={onChange}
									placeholder="Property description"
								/>
								{errors.description && (
									<Text className="text-red-500">
										{errors.description.message}
									</Text>
								)}
							</View>
						)}
					/>

					{/* Map */}
					<Text className="mb-2">Select Location</Text>
					<View
						style={{
							borderRadius: 20,
							overflow: 'hidden',
							marginBottom: 16,
							borderColor: 'grey',
							borderWidth: 1,
							borderStyle: 'solid',
						}}
					>
						<MapView
							style={{ height: 260, width: '100%' }}
							initialRegion={{
								latitude: watch('latitude'),
								longitude: watch('longitude'),
								latitudeDelta: 0.01,
								longitudeDelta: 0.01,
							}}
							onPress={(e) => {
								const coords = e.nativeEvent.coordinate;
								setValue('latitude', coords.latitude);
								setValue('longitude', coords.longitude);
								addAddressAuto(coords).then();
							}}
						>
							<Marker
								coordinate={{
									latitude: watch('latitude'),
									longitude: watch('longitude'),
								}}
							/>
						</MapView>
					</View>

					{/* Address */}
					<Controller
						control={control}
						name="address"
						render={({ field: { onChange, value } }) => (
							<View className="mb-3">
								<Text>Address</Text>
								<TextInput
									style={{
										borderWidth: 1,
										borderColor: 'gray',
										paddingHorizontal: 12,
										paddingVertical: 8,
										borderRadius: 40,
										marginVertical: 4,
									}}
									value={value}
									onChangeText={onChange}
									placeholder="Street, City, Country"
								/>
							</View>
						)}
					/>

					{/* Price, Area, Bedrooms, Bathrooms */}
					{['price', 'area', 'bedrooms', 'bathrooms', 'rating'].map(
						(field) => (
							<Controller
								key={field}
								control={control}
								name={field as keyof PropertyFormValues}
								render={({ field: { onChange, value } }) => (
									<View className="mb-3">
										<Text>
											{field.charAt(0).toUpperCase() +
												field.slice(1)}
										</Text>
										<TextInput
											style={{
												borderWidth: 1,
												borderColor: 'gray',
												paddingHorizontal: 12,
												paddingVertical: 8,
												borderRadius: 8,
												marginVertical: 4,
											}}
											keyboardType="numeric"
											value={value?.toString()}
											onChangeText={(text) => onChange(Number(text))}
										/>
									</View>
								)}
							/>
						)
					)}

					{/* Facilities */}
					<Text className="mb-2 font-bold">Facilities</Text>
					<View className="flex flex-row flex-wrap mb-3">
						{facilities.map((f) => (
							<TouchableOpacity
								key={f.title}
								className={`flex flex-row gap-2 items-center px-4 py-2 border border-mygrey-300 rounded-full mr-2 mb-4 ${
									facilitiesSelected?.includes(f.facility)
										? 'bg-blue-400'
										: 'bg-gray-200'
								}`}
								onPress={() => toggleFacility(f.facility)}
							>
								<Image source={f.icon} className="size-6" />
								<Text
									className={`${facilitiesSelected?.includes(f.facility) ? 'text-white' : 'text-black'}`}
								>
									{f.title}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Submit */}
					<TouchableOpacity
						className="bg-primary-300 py-3 rounded-full my-4"
						onPress={handleSubmit(onSubmit)}
						disabled={submitting}
					>
						<Text className="text-white font-bold text-center">
							{submitting ? 'Submitting...' : 'Add Property'}
						</Text>
					</TouchableOpacity>
				</View>
			) : (
				<View>
					<Text>PROPERTY FORM UPDATE</Text>
				</View>
			)}
		</>
	);
}
