import { ActionTypes } from '@/lib/constants/enums';
import React from 'react';
import { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Image,
	FlatList,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { databases, storage, ID } from '@/lib/appwrite';
// import { COLLECTIONS, config } from "@/lib/constants/data";
import { PropertyFormValues, PropertyFormSchema } from '@/lib/utils/validators';

type PropertyFormProps = {
	actionType: ActionTypes;
};

export default function PropertyForm({ actionType }: PropertyFormProps) {
	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<PropertyFormValues>({
		resolver: zodResolver(PropertyFormSchema),
		defaultValues: {
			name: '',
			type: '',
			description: '',
			address: '',
			latitude: 37.78825,
			longitude: -122.4324,
			price: 1000,
			area: 500,
			bedrooms: 1,
			bathrooms: 1,
			rating: 3,
			facilities: [],
			images: [],
			ownerId: '',
			gallery: [],
			reviews: [],
			agent: '',
		},
	});

	return (
		<>
			{actionType === ActionTypes.CREATE ? (
				<View>
					<Text>PROPERTY FORM CREATE</Text>
				</View>
			) : (
				<View>
					<Text>PROPERTY FORM UPDATE</Text>
				</View>
			)}
		</>
	);
}
