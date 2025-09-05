import {
	Client,
	Account,
	ID,
	Databases,
	OAuthProvider,
	Avatars,
	Query,
	Storage,
} from 'react-native-appwrite';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';
import { arrayBufferToBase64 } from '@/tools';

export const config = {
	platform: 'com.mlotocki.estate',
	endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
	projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
	databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
	galleriesCollectionId:
		process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
	reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
	agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
	propertiesCollectionId:
		process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
	bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
};

export const client = new Client();
client
	.setEndpoint(config.endpoint!)
	.setProject(config.projectId!)
	.setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function login() {
	try {
		const redirectUri = Linking.createURL('/'); // returned exp://192.168.0.17:8081/--/

		console.log(redirectUri);

		// const response = await account.createOAuth2Token(
		// 	OAuthProvider.Google,
		// 	redirectUri
		// );
		const oauthUrl = account.createOAuth2Token({
			provider: OAuthProvider.Google,
			success: redirectUri,
			failure: redirectUri,
		});
		// if (!response) throw new Error('Create OAuth2 token failed');
		if (!oauthUrl) throw new Error('Create OAuth2 token failed');

		// const browserResult = await openAuthSessionAsync(
		// 	response.toString(),
		// 	redirectUri
		// );
		const browserResult = await openAuthSessionAsync(
			oauthUrl.toString(),
			redirectUri
		);
		if (browserResult.type !== 'success')
			throw new Error('Create OAuth2 token failed');

		const url = new URL(browserResult.url);
		const secret = url.searchParams.get('secret')?.toString();
		const userId = url.searchParams.get('userId')?.toString();
		if (!secret || !userId) throw new Error('Create OAuth2 token failed');

		// const session = await account.createSession(userId, secret);
		const session = await account.createSession({
			userId,
			secret,
		});
		if (!session) throw new Error('Failed to create session');

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function logout() {
	try {
		// const result = await account.deleteSession('current');
		const result = await account.deleteSession({
			sessionId: 'current', // lub inny sessionId, jeśli chcesz wylogować konkretną sesję
		});

		return result;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function getCurrentUser() {
	try {
		const result = await account.get();
		if (result.$id) {
			// const userAvatar = avatar.getInitials(result.name);
			// Now Arg for getInitilas is the object with prop name, not string
			let avatarBase64: string | undefined;

			try {
				const buffer = await avatar.getInitials({
					name: result.name,
					background: '000000',
				});

				avatarBase64 = arrayBufferToBase64(buffer);
			} catch (avatarError) {
				console.warn('Failed to generate avatar initials:', avatarError);
				avatarBase64 = undefined;
			}

			return {
				...result,
				avatar: avatarBase64,
			};
		}

		return null;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function getLatestProperties(limit: number | string = 5) {
	try {
		 const parsedLimit = Number(limit) || 5; // fallback jeśli undefined albo NaN

		const result = await databases.listDocuments(
			config.databaseId!,
			config.propertiesCollectionId!,
			[Query.orderAsc('$createdAt'), Query.limit(Number(parsedLimit))]
		);

		return result.documents;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getProperties({
	filter,
	query,
	limit,
}: {
	filter: string;
	query: string;
	limit?: number;
}) {
	try {
		const buildQuery = [Query.orderDesc('$createdAt')];

		if (filter && filter !== 'All')
			buildQuery.push(Query.equal('type', filter));

		if (query)
			buildQuery.push(
				Query.or([
					Query.search('name', query),
					Query.search('address', query),
					Query.search('type', query),
				])
			);

		if (limit) buildQuery.push(Query.limit(limit));

		const result = await databases.listDocuments(
			config.databaseId!,
			config.propertiesCollectionId!,
			buildQuery
		);

		return result.documents;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getPropertyById({ id }: { id: string }) {
	try {
		const result = databases.getDocument(
			config.databaseId!,
			config.propertiesCollectionId!,
			// "68b87a490032efa65fc9",
			id
		);

		return result;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getAgentById({ id }: { id: string }) {
	try {
		const result = databases.getDocument(
			config.databaseId!,
			config.agentsCollectionId!,
			id
		);

		return result;
	} catch (error) {
		console.error(error);
		return null;
	}
}
