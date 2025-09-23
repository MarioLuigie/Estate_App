// modules
import Constants from 'expo-constants';
import {
	Account,
	Avatars,
	Client,
	Databases,
	Storage,
} from 'react-native-appwrite';

export const config = {
	platform: 'com.mlotocki.estate',
	endpoint: Constants.expoConfig?.extra?.auth?.appwriteEndpoint,
	projectId: Constants.expoConfig?.extra?.auth?.appwriteProjectId,
	databaseId: Constants.expoConfig?.extra?.auth?.appwriteDatabaseId,
	galleriesCollectionId:
		Constants.expoConfig?.extra?.auth?.galleriesCollectionId,
	reviewsCollectionId: Constants.expoConfig?.extra?.auth?.reviewsCollectionId,
	agentsCollectionId: Constants.expoConfig?.extra?.auth?.agentsCollectionId,
	propertiesCollectionId:
		Constants.expoConfig?.extra?.auth?.propertiesCollectionId,
	bookingsCollectionId:
		Constants.expoConfig?.extra?.auth?.bookingsCollectionId,
	usersCollectionId: Constants.expoConfig?.extra?.auth?.usersCollectionId,
	likesCollectionId: Constants.expoConfig?.extra?.auth?.likesCollectionId,
	bucketId: Constants.expoConfig?.extra?.auth?.bucketId,
	googleMapsApiKey: Constants.expoConfig?.extra?.auth?.googleMapsApiKey,
};

export const client = new Client()
	.setEndpoint(
		Constants.expoConfig?.extra?.auth?.appwriteEndpoint || config.endpoint
	)
	.setProject(
		Constants.expoConfig?.extra?.auth?.appwriteProjectId || config.projectId
	)
	.setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);