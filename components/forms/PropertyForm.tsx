import Select, { SelectOption } from '@/components/shared/SelectItem';
import {
	createProperty,
	getAddressFromCoordinates,
	getAgents,
	getCoordinatesFromAddress,
	updateProperty,
} from '@/lib/appwrite';
import { customMapStyles } from '@/lib/colorsJS';
import {
	facilities,
	types,
	getPropertyFormDefaultValues,
} from '@/lib/constants/data';
import { ActionTypes } from '@/lib/constants/enums';
import icons from '@/lib/constants/icons';
import { useGlobalContext } from '@/lib/global-provider';
import {
	PropertyFormValues,
	getPropertyFormSchema,
} from '@/lib/utils/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
	Alert,
	Image,
	Linking,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import MapView, { MapPressEvent, Region } from 'react-native-maps';
import PropertyMarker from '@/components/shared/PropertyMarker';
import { z } from 'zod';

type PropertyFormProps = {
	actionType: ActionTypes;
	id?: string;
	property?: any;
};

export default function PropertyForm({
	actionType,
	id,
	property,
}: PropertyFormProps) {
	const { user } = useGlobalContext();
	const [agents, setAgents] = useState<any[]>([]);
	const [isError, setIsError] = useState<boolean>(false);
	const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
	const [imageState, setImageState] = useState<string>(property?.image || '');
	const mapRef = useRef<MapView>(null);

	const PropertyFormSchema = getPropertyFormSchema(actionType);
	const PropertyFormDefaultValues = getPropertyFormDefaultValues(
		actionType,
		property
	);

	const isCreating = actionType === ActionTypes.CREATE;
	const isUpdating = actionType === ActionTypes.UPDATE;

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<z.infer<typeof PropertyFormSchema>>({
		resolver: zodResolver(PropertyFormSchema),
		defaultValues: PropertyFormDefaultValues,
	});

	const [submitting, setSubmitting] = useState(false);
	const facilitiesSelected = watch('facilities');
	const typeSelected = watch('type');
	// const rating = watch('rating');
	// const coords = {
	// 	latitude: watch('latitude'),
	// 	longitude: watch('longitude'),
	// };

	useEffect(() => {
		console.log('Errors:', errors);
	}, [errors]);

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

	const addMapMarkerAuto = async (address: string) => {
		const coords = await getCoordinatesFromAddress(address);

		if (coords) {
			setValue('longitude', coords.longitude);
			setValue('latitude', coords.latitude);

			const region: Region = {
				latitude: coords.latitude,
				longitude: coords.longitude,
				latitudeDelta: 0.01, // zoom – im mniejsza delta, tym bliżej
				longitudeDelta: 0.01,
			};

			mapRef?.current?.animateToRegion(region, 1000); // 1000ms animacji

			console.log('Place marked on map successfully');
			console.log('Map ref current', mapRef.current);
		}
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

			if (!result.canceled) {
				const image = result.assets[0];

				const imageToUpload = {
					uri: image.uri,
					name: image.fileName,
					type: image.mimeType,
					size: image.fileSize,
				};

				setImageState(image.uri);
				setValue('image', JSON.stringify(imageToUpload)); // set url in form

				console.log('IMAGE URI:', image.uri);
				console.log('IMAGE:', image);
			}
		} catch (error) {
			console.error('Image picker error:', error);
		}
	};

	const pickLocalization = (e: MapPressEvent) => {
		const coords = e.nativeEvent.coordinate;
		setValue('latitude', coords.latitude);
		setValue('longitude', coords.longitude);
		addAddressAuto(coords).then();
	};

	// --- Submit ---
	const onSubmit: SubmitHandler<z.infer<typeof PropertyFormSchema>> = async (
		data: z.infer<typeof PropertyFormSchema>
	) => {
		setSubmitting(true);
		try {
			if (!user) return;

			console.log('DATA:', data);

			// CREATE PRODUCT
			if (isCreating) {
				const createdProperty = await createProperty(data);

				if (createdProperty) {
					reset();
					setImageState('');
				}

				console.log('Property added:', createdProperty);
			}

			// UPDATE PRODUCT
			if (isUpdating) {
				const updatedProperty = await updateProperty(data);

				if (updatedProperty) {
					reset();
					setImageState('');
				}

				console.log('Property updated:', updatedProperty);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
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
							<Text className="text-red-500">{errors.name.message}</Text>
						)}
					</View>
				)}
			/>

			{/* Upload Image */}
			<View className="mb-3">
				<TouchableOpacity
					className="bg-blue-500 border border-mygrey-300 rounded-3xl"
					onPress={pickImage}
				>
					<View className="flex flex-row justify-center items-center gap-2 w-full h-[180px]">
						{imageState ? (
							<Image
								source={{ uri: imageState }}
								className="size-full rounded-3xl"
							/>
						) : (
							<View>
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
							</View>
						)}
					</View>
				</TouchableOpacity>
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
							<Text className="text-red-500">{errors.type.message}</Text>
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
							typeSelected === t.type ? 'bg-blue-400' : 'bg-gray-200'
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
					ref={mapRef}
					customMapStyle={customMapStyles}
					style={{ height: 260, width: '100%' }}
					initialRegion={{
						latitude: watch('latitude'),
						longitude: watch('longitude'),
						latitudeDelta: 0.01,
						longitudeDelta: 0.01,
					}}
					onPress={pickLocalization}
				>
					<PropertyMarker
						settings={{
							latitude: watch('latitude'),
							longitude: watch('longitude'),
							image: imageState,
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
							placeholder="Number Street, City, Country"
						/>
						<TouchableOpacity
							className="bg-primary-300 py-3 rounded-full my-4"
							onPress={() => addMapMarkerAuto(value)}
						>
							<Text className="text-white font-bold text-center">
								Locate entered address on map
							</Text>
						</TouchableOpacity>
					</View>
				)}
			/>

			{/* Price, Area, Bedrooms, Bathrooms */}
			{['price', 'area', 'bedrooms', 'bathrooms', 'rating'].map((field) => (
				<Controller
					key={field}
					control={control}
					name={field as keyof PropertyFormValues}
					render={({ field: { onChange, value } }) => (
						<View className="mb-3">
							<Text>
								{field.charAt(0).toUpperCase() + field.slice(1)}
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
			))}

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
				{isCreating && (
					<Text className="text-white font-bold text-center">
						{submitting ? 'Submitting...' : 'Add Property'}
					</Text>
				)}

				{isUpdating && (
					<Text className="text-white font-bold text-center">
						{submitting ? 'Submitting...' : 'Update Property'}
					</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}
