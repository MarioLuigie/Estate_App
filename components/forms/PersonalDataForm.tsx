// modules
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
// lib
import { updateCurrentUser } from '@/lib/actions/user.actions';
import { ROUTES } from '@/lib/constants/paths';
import { useGlobalContext } from '@/lib/context/global-provider';
import {
	PersonalDataFormValues,
	PersonalDataFormSchema,
} from '@/lib/validators/validators';
import { PERSONAL_DATA_FORM_DEFAULT_VALUES } from '@/lib/tools/data';
// components
import CustomTouchable from '@/components/ui/CustomTouchable';

type PersonalDataFormProps = {
	profile?: any;
};

export default function PersonalDataForm({ profile }: PersonalDataFormProps) {
	const { authUser } = useGlobalContext();
	const [isError, setIsError] = useState<boolean>(false);

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<PersonalDataFormValues>({
		resolver: zodResolver(PersonalDataFormSchema),
		defaultValues: profile || PERSONAL_DATA_FORM_DEFAULT_VALUES,
	});

	useEffect(() => {
		if (profile) {
			reset(profile);
		}
	}, [profile, reset]);

	const [submitting, setSubmitting] = useState(false);

	// --- Submit ---
	const onSubmit: SubmitHandler<PersonalDataFormValues> = async (
		data: PersonalDataFormValues
	) => {
		setSubmitting(true);
		try {
			if (!authUser) return;

			// UPDATE PROFILE
			const updatedProfile = await updateCurrentUser(data);
			if (updatedProfile) {
				router.push({ pathname: ROUTES.PROFILE_MY_PROPERTIES });
				reset();
			}

			console.log('Profile updated successfully:', updatedProfile);
		} catch (err) {
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<View className="py-4 bg-white">
			{/* Full Name */}
			<Controller
				control={control}
				name="fullName"
				render={({ field: { onChange, value } }) => (
					<View className="mb-3">
						<Text>Full Name</Text>
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
							placeholder="Full Name"
						/>
						{errors.fullName && (
							<Text className="text-red-500">
								{errors.fullName.message}
							</Text>
						)}
					</View>
				)}
			/>

			{/* Email */}
			<Controller
				control={control}
				name="email"
				render={({ field: { onChange, value } }) => (
					<View className="mb-3">
						<Text>E-mail</Text>
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
							placeholder="example@example.com"
						/>
						{errors.email && (
							<Text className="text-red-500">
								{errors.email.message}
							</Text>
						)}
					</View>
				)}
			/>

			{/* Phone */}
			<Controller
				control={control}
				name="phone"
				render={({ field: { onChange, value } }) => (
					<View className="mb-3">
						<Text>Phone</Text>
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
							placeholder="+48 123 123 123"
						/>
						{errors.phone && (
							<Text className="text-red-500">
								{errors.phone.message}
							</Text>
						)}
					</View>
				)}
			/>

			{/* Submit */}
			<CustomTouchable
				onPress={handleSubmit(onSubmit)}
				disabled={submitting}
				className="mt-8"
			>
				<Text
					className="text-white font-bold text-center"
					style={{ fontSize: 15 }}
				>
					{submitting ? 'Submitting...' : 'Update'}
				</Text>
			</CustomTouchable>
		</View>
	);
}
