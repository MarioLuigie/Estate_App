// modules
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
// lib
import icons from '@/lib/constants/icons';
import { contact, featureNotAvailable } from '@/lib/tools';
import { ContactMethod } from '@/lib/constants/enums';

type AgentContactProps = {
	agent: any;
	isTitle?: boolean;
};

export default function AgentContact({
	agent,
	isTitle = true,
}: AgentContactProps) {
	return (
		<View className="w-full border-t border-primary-200 pt-2 mt-3">
			{isTitle && (
				<Text className="text-black-300 text-xl font-rubik-bold">
					Agent
				</Text>
			)}

			<View className="flex flex-row items-center justify-between mt-4">
				<View className="flex flex-row items-center">
					<Image
						source={{ uri: agent?.avatar }}
						className="size-14 rounded-full"
					/>

					<View className="flex flex-col items-start justify-center ml-3">
						<Text className="text-lg text-black-300 text-start font-rubik-bold">
							{agent?.name}
						</Text>
						<Text className="text-sm text-black-200 text-start font-rubik-medium">
							{agent?.email}
						</Text>
					</View>
				</View>
				{/* Agent contact */}
				<View className="flex flex-row items-center gap-5">
					<TouchableOpacity onPress={() => featureNotAvailable('Chat')}>
						<Image source={icons.chat} className="size-7" />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => contact({type: ContactMethod.PHONE, value: '+48509312253'})}>
						<Image source={icons.phone} className="size-7" />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
