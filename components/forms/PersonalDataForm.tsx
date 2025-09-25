// modules
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
// lib
import { updateCurrentUser } from '@/lib/actions/user.actions';
import { useGlobalContext } from '@/lib/context/global-provider';
import {
	PersonalDataFormValues,
	PersonalDataFormSchema,
} from '@/lib/validators/validators';
import { PERSONAL_DATA_FORM_DEFAULT_VALUES } from '@/lib/tools/data';
// components
import CustomTouchable from '@/components/ui/CustomTouchable';
import { useBookingsStore } from '@/lib/store/bookings.store';

type PersonalDataFormProps = {
	profile?: any;
	redirectUser: () => void;
};

export default function PersonalDataForm({
	profile,
	redirectUser,
}: PersonalDataFormProps) {
	const { authUser } = useGlobalContext();
	const [isError, setIsError] = useState<boolean>(false);
	const setUserData = useBookingsStore((state) => state.setUserData);
	const [submitting, setSubmitting] = useState(false);

	const {
		control,
		handleSubmit,
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

	// --- Submit ---
	const onSubmit: SubmitHandler<PersonalDataFormValues> = async (
		data: PersonalDataFormValues
	) => {
		setSubmitting(true);
		try {
			if (!authUser) return;
			// Sprawdzenie, czy dane faktycznie się zmieniły względem początkowego profilu
			const hasChanged = Object.keys(profile).some(
				(key) => (data as any)[key] !== (profile as any)[key]
			);

			if (!hasChanged) {
				// Nic się nie zmieniło, ustawiamy dane u rodzica i kończymy
				setUserData(data.fullName, data.email, data.phone, authUser.id);
				redirectUser();
				return;
			}
			// Jeśli coś się zmieniło → update w API
			const updatedProfile = await updateCurrentUser(data);
			if (updatedProfile) {
				setUserData(
					updatedProfile.fullName,
					updatedProfile.email,
					updatedProfile.phone,
					updatedProfile.authId
				);
				redirectUser();
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
		<View className="py-4 bg-white px-2">
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
					{submitting ? 'Submitting...' : 'Continue'}
				</Text>
			</CustomTouchable>
		</View>
	);
}
