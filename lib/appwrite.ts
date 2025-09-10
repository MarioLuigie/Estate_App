import { arrayBufferToBase64 } from '@/lib/tools';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import {
	Account,
	Avatars,
	Client,
	Databases,
	ID,
	OAuthProvider,
	Query,
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

export async function login() {
	try {
		// --- 1. Rozróżniamy środowisko ---
		const isDev = Constants.executionEnvironment === 'storeClient'; // Expo Go
		const projectId =
			Constants.expoConfig?.extra?.auth?.appwriteProjectId ||
			config?.projectId;
		const scheme = `appwrite-callback-${projectId}`;

		// --- 2. Tworzymy poprawny redirectUri ---
		const redirectUri = isDev
			? makeRedirectUri({ preferLocalhost: true }) // Dev Build / Expo Go
			: makeRedirectUri({ scheme }); // Standalone build

		console.log('Redirect URI użyty do OAuth:', redirectUri);
		console.log('FUNCTION_0:', redirectUri);

		// --- 3. Generujemy URL OAuth ---
		const oauthUrl = account.createOAuth2Token({
			provider: OAuthProvider.Google,
			success: redirectUri,
			failure: redirectUri,
		});

		if (!oauthUrl) throw new Error('Nie udało się wygenerować oauthUrl');

		// --- 4. Otwieramy przeglądarkę / WebBrowser ---
		const result = await WebBrowser.openAuthSessionAsync(
			oauthUrl.toString(),
			redirectUri
		);

		if (result.type !== 'success' || !result.url)
			throw new Error('OAuth login anulowany lub brak URL');

		// --- 5. Parsujemy secret i userId z callback URL ---
		const url = new URL(result.url);
		const secret = url.searchParams.get('secret');
		const userId = url.searchParams.get('userId');

		if (!secret || !userId)
			throw new Error('Brak secret albo userId w callback');

		// --- 6. Tworzymy sesję Appwrite ---
		await account.createSession({ userId, secret });

		console.log('Login zakończony sukcesem');
		return true;
	} catch (error) {
		console.error('OAuth login error', error);
		return false;
	}
}

export async function logout() {
	try {
		// const result = await account.deleteSession('current');
		const result = await account.deleteSession({
			sessionId: 'current', // lub inny sessionId, jeśli chcesz wylogować konkretną sesję
		});

		console.log('Logged out successfully', result);

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
		if (error instanceof Error) {
			// Teraz TS wie, że error ma property message
			if (error.message.includes('missing scopes')) {
				return null; // cicho obsłużony wyjątek
			}
			console.error(error); // inne błędy logujemy
		} else {
			// Obsługa nie-Error typu (np. string lub object)
			console.error('Unexpected error:', error);
		}
		return null;
	}
}

export async function getLatestProperties(limit: number | string = 5) {
	try {
		const parsedLimit = Number(limit) || 5; // fallback jeśli undefined albo NaN

		const result = await databases.listDocuments(
			config.databaseId!,
			config.propertiesCollectionId!,
			[Query.orderDesc('$createdAt'), Query.limit(Number(parsedLimit))]
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
		const result = await databases.getDocument(
			config.databaseId!,
			config.propertiesCollectionId!,
			id,
			[Query.select(['*', 'gallery.*', 'reviews.*'])] // '*' = wszystkie własne pola rekordu
			// 'gallery.*', 'reviews.*', 'agent.*' = pełne obiekty relacji
		);

		return result;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getAgentById({ id }: { id: string }) {
	try {
		const result = await databases.getDocument(
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

export async function getAgents() {
	try {
		const result = await databases.listDocuments(
			config.databaseId!,
			config.agentsCollectionId!
		);

		return result.documents;
	} catch (error) {
		console.log('Not found agents', error);
		return null;
	}
}

export async function getAddressFromCoordinates(lat: number, lng: number) {
	try {
		const apiKey = config.googleMapsApiKey;

		const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
		// console.log('GOOGLE MAPS API KEY:', apiKey);

		const response = await fetch(url);
		const data = await response.json();

		// console.log('GOOGLE MAPS data:', data);

		if (data.status !== 'OK' || !data.results.length) {
			console.warn('Google Maps returned no results');
			return null;
		}

		const result = data.results[0];
		const addressComponents = result.address_components;

		// console.log('GOOGLE MAPS data result:', result);

		const street = addressComponents.find((c: any) =>
			c.types.includes('route')
		)?.long_name;
		const buildingNumber = addressComponents.find((c: any) =>
			c.types.includes('street_number')
		)?.long_name;
		const city = addressComponents.find((c: any) =>
			c.types.includes('locality')
		)?.long_name;
		const country = addressComponents.find((c: any) =>
			c.types.includes('country')
		)?.long_name;

		return {
			street:
				buildingNumber && street
					? `${buildingNumber} ${street}`
					: street || 'Unknown Street',
			city: city || 'Unknown City',
			country: country || 'Unknown Country',
		};
	} catch (err) {
		console.error('Error in getAddressFromCoordinates:', err);
		return null;
	}
}

export async function getMyProperties({ userId }: { userId: string }) {
	try {
		const result = await databases.listDocuments(
			config.databaseId!,
			config.propertiesCollectionId!,
			[Query.equal('ownerId', userId), Query.orderDesc('$createdAt')]
		);
		return result.documents;
	} catch (err) {
		console.error('Error in getMyProperties:', err);
		return null;
	}
}

// export async function getMyBookings({ userId }: { userId: string }) {
//   const result = await databases.listDocuments(
//     config.databaseId!,
//     COLLECTIONS.BOOKINGS!,
//     [Query.equal('userId', userId)]
//   );
//   return result.documents;
// }

export async function createProperty(property: any) {
	try {
		const result = await databases.createDocument(
			config.databaseId!,
			config.propertiesCollectionId!,
			ID.unique(),
			{
				...property,
				geolocation: `${property.latitude},${property.longitude}`,
				gallery: ['68bffaa0002e92475682', '68bffaa00006c19b27c9'],
				reviews: ['68bffa9e002eb11fed4b'],
				image: 'https://images.pexels.com/photos/11299672/pexels-photo-11299672.jpeg',
			}
		);

		return result;
	} catch (error) {
		console.error('Property not created', error);
	}
}

export async function addImageToStorage(file: {
	uri: string;
	name: string;
	type: string;
	size: number;
}): Promise<{ fileId: string; url: string } | null> {
	try {
		console.log('ADD IMAGE TO STORAGE1:', file);

		const fetchBlob = async (uri: string) => {
			const response = await fetch(uri);
			const blob = await response.blob();
			return blob;
		};

		const blobFile = await fetchBlob(file.uri);

		const isValidExt = (name: string) => {
			const ext = name.split('.').pop()?.toLowerCase();
			return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
		};

		if (!isValidExt(file.name)) {
			throw new Error('Unsupported file type. Only JPG and PNG allowed.');
		}

		const safeFile = {
			uri: file.uri,
			name: file.name,
			type: file.type,
			size: file.size,
		}; // sdk file type matched

		console.log('ADD IMAGE TO STORAGE2:', safeFile);

		const uploaded = await storage.createFile({
			bucketId: config.bucketId!,
			fileId: ID.unique(),
			file: safeFile,
			permissions: ['read("any")'],
		});

		console.log('ADD IMAGE TO STORAGE3:', uploaded);

		const fileId = uploaded.$id;
		const url = `${config.endpoint!}/v1/storage/buckets/${config.bucketId}/files/${fileId}/view?project=${config.projectId}`;

		return { fileId, url };
	} catch (error) {
		console.error('Image upload error:', error);
		return null;
	}
}
