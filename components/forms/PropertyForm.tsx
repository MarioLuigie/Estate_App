import { ActionTypes } from '@/lib/constants/enums';
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	FlatList,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { createProperty, getAgents } from '@/lib/appwrite';
// import { COLLECTIONS, config } from "@/lib/constants/data";
import { PropertyFormValues, PropertyFormSchema } from '@/lib/utils/validators';
import { useGlobalContext } from '@/lib/global-provider';
import { PropertyDefaultValues, facilities } from '@/lib/constants/data';
import Select, { SelectOption } from '@/components/shared/SelectItem';

type PropertyFormProps = {
	actionType: ActionTypes;
};

export default function PropertyForm({ actionType }: PropertyFormProps) {
	const { user } = useGlobalContext();
		const [agents, setAgents] = useState<any[]>([]);

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<PropertyFormValues>({
		resolver: zodResolver(PropertyFormSchema),
		defaultValues: PropertyDefaultValues,
	});

	const [submitting, setSubmitting] = useState(false);
	const images = watch('image');
	const facilitiesSelected = watch('facilities');
	const rating = watch('rating');

	useEffect(() => {
		getAgents()
		.then(res => setAgents(res ?? []))
	}, [])

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
										borderRadius: 8,
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
										borderRadius: 8,
										marginVertical: 4,
									}}
									value={value}
									onChangeText={onChange}
									placeholder="Street, City, Country"
								/>
							</View>
						)}
					/>

					{/* Map */}
					<Text className="mb-2">Select Location</Text>
					<View
						style={{
							borderRadius: 12,
							overflow: 'hidden',
							marginBottom: 16,
						}}
					>
						<MapView
							style={{ height: 200, width: '100%' }}
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
									facilitiesSelected?.includes(f.title)
										? 'bg-blue-400'
										: 'bg-gray-200'
								}`}
								onPress={() => toggleFacility(f.title)}
							>
								<Image source={f.icon} className="size-6" />
								<Text
									className={`${facilitiesSelected?.includes(f.title) ? 'text-white' : 'text-black'}`}
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

					<FlatList
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
					/>

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
