// modules
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
	Permission,
	Query,
	Role,
	Storage,
} from 'react-native-appwrite';
// lib
import {
	arrayBufferToBase64,
	normalizeProperty,
	prepareImageForStorage,
	uploadWithRetry,
} from '@/lib/tools/';

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
			usersCollectionId:
		Constants.expoConfig?.extra?.auth?.usersCollectionId,
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

		// console.log('Redirect URI użyty do OAuth:', redirectUri);
		// console.log('FUNCTION_0:', redirectUri);

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
		await account.deleteSession({
			sessionId: 'current',
		});
		// throw new Error();
	} catch (error) {
		console.error('Logout error:', error);
		throw error;
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
			[
				Query.orderDesc('$createdAt'),
				Query.limit(Number(parsedLimit)),
				Query.select(['*', 'gallery.*', 'reviews.*', 'image.*']),
			]
		);

		// console.log("getLatestProperties:", typeof result?.documents[0].image[0].image)

		const parsedList = result?.documents.map(normalizeProperty);

		return parsedList;
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

		buildQuery.push(Query.select(['*', 'image.*', 'gallery.*', 'reviews.*']));

		const result = await databases.listDocuments(
			config.databaseId!,
			config.propertiesCollectionId!,
			buildQuery
		);

		const parsedList = result?.documents.map(normalizeProperty);

		return parsedList;
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
			[Query.select(['*', 'gallery.*', 'reviews.*', 'image.*'])] // '*' = wszystkie własne pola rekordu
			// 'gallery.*', 'reviews.*', 'agent.*' = pełne obiekty relacji
		);

		const parsedProperty = {
			...result,
			image: result.image.map((img: any) => ({
				...img,
				image: JSON.parse(img.image),
			})),
		} as any;

		return parsedProperty;
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

export async function getCoordinatesFromAddress(address: string) {
	try {
		const apiKey = config.googleMapsApiKey;

		const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
			address
		)}&key=${apiKey}`;

		const response = await fetch(url);
		const data = await response.json();

		if (data.status !== 'OK' || !data.results.length) {
			console.warn('Google Maps returned no results');
			return null;
		}

		const location = data.results[0].geometry.location;

		return {
			latitude: location.lat,
			longitude: location.lng,
		};
	} catch (err) {
		console.error('Error in getCoordinatesFromAddress:', err);
		return null;
	}
}

export async function getMyProperties({ userId }: { userId: string }) {
	try {
		const result = await databases.listDocuments(
			config.databaseId!,
			config.propertiesCollectionId!,
			[
				Query.equal('ownerId', userId),
				Query.orderDesc('$createdAt'),
				Query.select(['*', 'gallery.*', 'reviews.*', 'image.*']),
			]
		);

		const parsedList = result?.documents.map(normalizeProperty);
		return parsedList;
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

export async function deleteGallery(id: string) {
	try {
		const result = await databases.deleteDocument(
			config.databaseId!,
			config.galleriesCollectionId!,
			id
		);

		return result;
	} catch (error) {
		console.error('Property not created', error);
		return null;
	}
}

export async function createGallery(data: { url: string; fileId: string }) {
	try {
		const currentUser = await account.get();
		const result = await databases.createDocument(
			config.databaseId!,
			config.galleriesCollectionId!,
			ID.unique(),
			{ image: JSON.stringify(data) },
			[
				Permission.read(Role.users()),
				Permission.update(Role.user(currentUser.$id)),
				Permission.delete(Role.user(currentUser.$id)),
			]
		);

		return result;
	} catch (error) {
		console.error('Property not created', error);
		return null;
	}
}

export async function createProperty(data: any) {
	try {
		const currentUser = await account.get();
		const preparedImage = prepareImageForStorage(data?.image[0]);
		// const uploadedImage = await addImageToStorage(preparedImage); // { fileId: string, url: string }

		const uploadedImage = await uploadWithRetry(
			addImageToStorage,
			preparedImage
		); // { fileId: string, url: string }
		const resultGallery = await createGallery(uploadedImage!);

		const resultProperty = await databases.createDocument(
			config.databaseId!,
			config.propertiesCollectionId!,
			ID.unique(),
			{
				...data,
				geolocation: `${data.latitude},${data.longitude}`,
				gallery: ['68bffaa10007aaf06a7b', '68bffaa00025cfaf074d'],
				reviews: ['68bffa9e00262f951c8c'],
				image: [resultGallery?.$id],
				ownerId: currentUser.$id,
			},
			[
				Permission.read(Role.users()),
				Permission.update(Role.user(currentUser.$id)),
				Permission.delete(Role.user(currentUser.$id)),
			]
		);

		if (resultProperty.image?.[0]?.image) {
			resultProperty.image[0].image = JSON.parse(
				resultProperty.image[0].image
			);
		}

		return resultProperty; // clear js object
	} catch (error) {
		console.error('Property not created', error);
		return null;
	}
}

export async function updateMyProperty(data: any) {
	// First, add a new file to Storage.
	// If the upload is successful, try updating the document in the DB.
	// If the DB update is successful, delete the old file.
	// If the DB update fails, delete the new file (rollback).0

	// If image was not changed in form
	const property = await getPropertyById({ id: data?.$id });

	const oldImage = property?.image?.[0]?.image;
	const newImage = data?.image?.[0];
	const oldImageId = oldImage?.fileId;

	// Sprawdzenie, czy obrazek został zmieniony
	const currentImageId =
		'image' in (newImage || {}) ? newImage.image.fileId : null;
	const isImageChanged = oldImageId !== currentImageId;

	console.log(oldImageId);
	console.log(currentImageId);

	if (!isImageChanged) {
		try {
			const result = await databases.updateDocument(
				config.databaseId!,
				config.propertiesCollectionId!,
				data.$id,
				{ ...data, image: [property?.image?.[0].$id] }
			);

			return result;
		} catch (error) {
			console.error('Property not updated', error);
			return null;
		}
	}

	// If image was changed in form
	try {
		// First, add a new file to Storage.
		const preparedImage = prepareImageForStorage(newImage);
		const uploadedNewImage = await uploadWithRetry(
			addImageToStorage,
			preparedImage
		);

		if (!uploadedNewImage) throw new Error('Upload failed');

		try {
			// If the upload is successful, try creating the new document in the DB in galleries.
			const resultGallery = await createGallery(uploadedNewImage);

			// If the resultGallery is successful, try deleting the old document in the DB in galleries.
			try {
				await deleteGallery(property.image[0].$id);
			} catch (deleteError) {
				console.warn("Couldn't delete old gallery record", deleteError);
			}

			// If the upload is successful, try updating the document in the DB in properties.
			const result = await databases.updateDocument(
				config.databaseId!,
				config.propertiesCollectionId!,
				data.$id,
				{ ...data, image: [resultGallery?.$id] }
			);

			// If the DB update is successful, delete the old file
			if (result && oldImageId) {
				await deleteImageFromStorageWithRetry(oldImageId);
			}

			return result;
		} catch (dbError) {
			// Rollback - If the DB update fails, delete the new file (rollback).
			await deleteImageFromStorageWithRetry(uploadedNewImage.fileId);
			throw dbError;
		}
	} catch (error) {
		console.error('Property not updated', error);
		return null;
	}
}

export async function deleteAllPropertiesAtomic(
	properties: { id: string; imageId: string }[]
) {
	const results: { id: string; success: boolean }[] = [];

	for (const property of properties) {
		const { id, imageId } = property;

		try {
			const imageDeleted = await deleteImageFromStorageWithRetry(imageId);
			if (!imageDeleted) {
				console.warn(
					`Property ${id} NOT deleted: failed to delete image ${imageId}.`
				);
				results.push({ id, success: false });
				continue; // go next
			}

			// Remove document from db
			await databases.deleteDocument(
				config.databaseId!,
				config.propertiesCollectionId!,
				id
			);

			console.log(`Property ${id} deleted successfully (DB + Storage).`);
			results.push({ id, success: true });
		} catch (error) {
			console.error(`Failed to delete property ${id}:`, error);
			results.push({ id, success: false });
		}
	}

	// Summary
	const failed = results.filter((r) => !r.success);
	if (failed.length > 0) {
		console.warn(`${failed.length} properties failed to delete.`);
	} else {
		console.log('All properties deleted successfully.');
	}

	return results;
}

const MAX_STORAGE_RETRIES = 3;
const RETRY_DELAY_MS = 500;

export async function deleteMyPropertyAtomic(id: string, imageId: string) {
	try {
		// First remove image file from storage
		const imageDeleted = await deleteImageFromStorageWithRetry(imageId);
		if (!imageDeleted) {
			console.warn(
				`Property ${id} NOT deleted: failed to delete image ${imageId}.`
			);
			return false;
		}

		// When image removed from storage, remove document from db
		await databases.deleteDocument(
			config.databaseId!,
			config.propertiesCollectionId!,
			id
		);

		console.log(`Property ${id} deleted successfully (DB + Storage).`);
		return true;
	} catch (error) {
		console.error(`Failed to delete property ${id}:`, error);
		return false;
	}
}

async function deleteImageFromStorageWithRetry(
	imageId: string
): Promise<boolean> {
	for (let attempt = 1; attempt <= MAX_STORAGE_RETRIES; attempt++) {
		try {
			await storage.deleteFile(config.bucketId!, imageId);
			console.log(`Image ${imageId} deleted successfully.`);
			return true;
		} catch (err) {
			console.warn(
				`Attempt ${attempt} to delete image ${imageId} failed.`,
				err
			);
			if (attempt < MAX_STORAGE_RETRIES) {
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
			} else {
				console.error(
					`Failed to delete image ${imageId} after ${attempt} attempts.`
				);
				return false;
			}
		}
	}
	return false;
}

export async function addImageToStorage(file: {
	uri: string;
	name: string;
	type: string;
	size: number;
}): Promise<{ fileId: string; url: string } | null> {
	try {
		// console.log('BUCKET ID:', config.bucketId);
		// console.log('ADD IMAGE TO STORAGE1:', file);

		// const fetchBlob = async (uri: string) => {
		// 	const response = await fetch(uri);
		// 	const blob = await response.blob();
		// 	return blob;
		// };

		// const blobFile = await fetchBlob(file.uri);

		const isValidExt = (name: string): boolean => {
			const ext = name.split('.').pop()?.toLowerCase();
			return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
		};

		if (file.name && !isValidExt(file.name)) {
			throw new Error('Unsupported file type. Only JPG and PNG allowed.');
		}

		const uploaded = await storage.createFile({
			bucketId: config.bucketId!,
			fileId: ID.unique(),
			file,
			permissions: ['read("any")'],
		});

		const fileId = uploaded.$id;
		const url = `${config.endpoint!}/storage/buckets/${config.bucketId}/files/${fileId}/view?project=${config.projectId}`;

		return { fileId, url };
	} catch (error) {
		console.error('Image upload error:', error);
		return null;
	}
}

export async function getBookingsByPropertyId(propertyId: string) {
	try {
		const result = await databases.listDocuments(
			config.databaseId!,
			config.bookingsCollectionId!,
			[Query.equal('property', propertyId)]
		);

		return result.documents;
	} catch (error) {
		console.error('Bookings not founded error:', error);
		return null;
	}
}

export async function createBooking(data: any) {
	try {
		const result = await databases.createDocument(
			config.databaseId!,
			config.bookingsCollectionId!,
			data,
			[], // permissions
		)

		return result;
	} catch (error) {
		console.error('Bookings not founded error:', error);
		return null;
	}
}
