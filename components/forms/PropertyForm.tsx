import { ActionTypes } from '@/lib/constants/enums';
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	// FlatList,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import {
	createProperty,
	getAddressFromCoordinates,
	getAgents,
} from '@/lib/appwrite';
// import { COLLECTIONS, config } from "@/lib/constants/data";
import { PropertyFormValues, PropertyFormSchema } from '@/lib/utils/validators';
import { useGlobalContext } from '@/lib/global-provider';
import { PropertyDefaultValues, facilities, types } from '@/lib/constants/data';
import Select, { SelectOption } from '@/components/shared/SelectItem';

type PropertyFormProps = {
	actionType: ActionTypes;
};

// type AddressType = {
// 	street: string;
// 	city: string;
// 	country: string;
// };

export default function PropertyForm({ actionType }: PropertyFormProps) {
	const { user } = useGlobalContext();
	const [agents, setAgents] = useState<any[]>([]);
	// const [addressState, setAddressState] = useState<AddressType>({
	// 	street: '',
	// 	city: '',
	// 	country: '',
	// });

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
	// const images = watch('image');
	const facilitiesSelected = watch('facilities');
	const typeSelected = watch('type');
	// const rating = watch('rating');
	// const coords = {
	// 	latitude: watch('latitude'),
	// 	longitude: watch('longitude'),
	// };

	useEffect(() => {
		getAgents().then((res) => setAgents(res ?? []));
	}, []);

	const agentsOptions: SelectOption[] = agents.map((a) => ({
		id: a.$id,
		label: a.name,
		subLabel: a.email,
		avatar: a.avatar,
	}));

	// --- Upload zdjęcia ---
	// const pickImage = async () => {
	// 	const result = await ImagePicker.launchImageLibraryAsync({
	// 		mediaTypes: ImagePicker.MediaTypeOptions.Images,
	// 		allowsMultipleSelection: false,
	// 	});

	// 	if (!result.canceled) {
	// 		try {
	// 			const file = await fetch(result.uri).then((res) => res.blob());
	// 			const uploaded = await storage.createFile(
	// 				config.bucketId!,
	// 				ID.unique(),
	// 				file
	// 			);
	// 			setValue('images', [...images, uploaded.$id]);
	// 		} catch (err) {
	// 			console.error('Upload failed', err);
	// 		}
	// 	}
	// };

	// --- Submit ---
	const onSubmit = async (data: PropertyFormValues) => {
		setSubmitting(true);
		try {
			if (!user) return;

			console.log('DATA:', data);
			const createdProperty = await createProperty({
				...data,
				ownerId: user.$id,
			});

			if (createdProperty) reset();

			console.log('Property added:', createdProperty);
		} catch (err) {
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

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

					{/* Upload Images */}
					{/* <TouchableOpacity
						className="bg-blue-500 py-2 rounded mb-3"
						onPress={pickImage}
					>
						<Text className="text-white text-center">Add Image</Text>
					</TouchableOpacity> */}

					{/* <FlatList
						data={images}
						horizontal
						renderItem={({ item }) => (
							<View className="mr-2">
								<Image
									source={{
										uri: `https://cloud.appwrite.io/v1/storage/buckets/${config.bucketId}/files/${item}/view?project=${config.projectId}`,
									}}
									className="w-24 h-24 rounded"
								/>
							</View>
						)}
						keyExtractor={(item, index) => item + index}
					/> */}

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
