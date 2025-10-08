// modules
import { ID, Permission, Query, Role } from 'react-native-appwrite';
// lib
import { createGallery, deleteGallery } from '@/lib/actions/galleries.actions';
import * as Appwrite from '@/lib/services/appwrite';
import { normalizeProperty, prepareImageForStorage } from '@/lib/tools/';
import { uploadWithRetry } from '@/lib/utils/';

// HELPER
export async function addOwnLikesToProperty(properties: any[]) {
	try {
		if (!properties.length) return [];

		const propertyIds = properties.map((p) => p.$id);

		const likesResult = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.likesCollectionId!,
			[Query.equal('property', propertyIds)] 
		);

		
		const likesCountMap: Record<string, number> = {};
		likesResult.documents.forEach((doc) => {
			const pid = doc.property;
			likesCountMap[pid] = (likesCountMap[pid] || 0) + 1;
		});

		
		return properties.map((p) => ({
			...p,
			likes: likesCountMap[p.$id] || 0,
		}));
	} catch (error) {
		console.error(`Problem with adding likes into property`, error);
		return properties.map((p) => ({ ...p, likes: 0 }));
	}
}

// READ PROPERTIES
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

		const result = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.propertiesCollectionId!,
			buildQuery
		);

		const parsedList = result?.documents.map(normalizeProperty);

		const parsedListWithLikes = await addOwnLikesToProperty(parsedList);

		return parsedListWithLikes;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getLatestProperties(limit: number | string = 5) {
	try {
		const parsedLimit = Number(limit) || 5; 

		const result = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.propertiesCollectionId!,
			[
				Query.orderDesc('$createdAt'),
				Query.limit(Number(parsedLimit)),
				Query.select(['*', 'gallery.*', 'reviews.*', 'image.*']),
			]
		);

		const parsedList = result?.documents.map(normalizeProperty);

		const parsedListWithLikes = await addOwnLikesToProperty(parsedList);

		return parsedListWithLikes;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getPropertyById({ id }: { id: string }) {
	try {
		const result = await Appwrite.databases.getDocument(
			Appwrite.config.databaseId!,
			Appwrite.config.propertiesCollectionId!,
			id,
			[Query.select(['*', 'gallery.*', 'reviews.*', 'image.*', 'agent.*'])] 
		);

		const parsedProperty = {
			...result,
			image: result.image.map((img: any) => ({
				...img,
				image: JSON.parse(img.image),
			})),
		} as any;

		const parsedListWithLikes = await addOwnLikesToProperty([parsedProperty]);

		if (parsedListWithLikes?.length === 1) return parsedListWithLikes[0];
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getPropertiesByIds(ids: string[]) {
	if (!ids || ids.length === 0) return [];

	try {
		const buildQuery = [
			Query.equal('$id', ids),
			Query.select(['*', 'image.*', 'gallery.*', 'reviews.*', 'agent.*']),
		];

		const result = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.propertiesCollectionId!,
			buildQuery
		);

		const parsedList = result?.documents.map(normalizeProperty);

		return parsedList;
	} catch (error) {
		console.error('getPropertiesByIds error:', error);
		return [];
	}
}

export async function getMyProperties({ userId }: { userId: string }) {
	try {
		const result = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.propertiesCollectionId!,
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

export async function getLikesByUser(userId: string) {
	try {
		const result = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.likesCollectionId!,
			[Query.equal('owner', userId)]
		);

		return result.documents; 
	} catch (error) {
		console.error('Error fetching user likes:', error);
		return [];
	}
}

export async function getLikeByUserAndProperty(
	userId: string,
	propertyId: string
) {
	try {
		if (!userId && !propertyId) return;

		const result = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.likesCollectionId!,
			[
				Query.equal('owner', userId),
				Query.equal('property', propertyId),
				Query.limit(1),
			]
		);

		return result.documents[0];
	} catch (error) {
		console.error('Like not found error:', error);
		return null;
	}
}

export async function getLikesByProperty(propertyId: string) {
	try {
		if (!propertyId) return;

		const result = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.likesCollectionId!,
			[Query.equal('property', propertyId)]
		);

		return result.documents;
	} catch (error) {
		console.error('Likes not found error:', error);
		return null;
	}
}

export async function getAgentById({ id }: { id: string }) {
	try {
		const result = await Appwrite.databases.getDocument(
			Appwrite.config.databaseId!,
			Appwrite.config.agentsCollectionId!,
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
		const result = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.agentsCollectionId!
		);

		return result.documents;
	} catch (error) {
		console.log('Not found agents', error);
		return null;
	}
}

export async function getAddressFromCoordinates(lat: number, lng: number) {
	try {
		const apiKey = Appwrite.config.googleMapsApiKey;

		const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

		const response = await fetch(url);
		const data = await response.json();

		if (data.status !== 'OK' || !data.results.length) {
			console.warn('Google Maps returned no results');
			return null;
		}

		const result = data.results[0];
		const addressComponents = result.address_components;

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
		const apiKey = Appwrite.config.googleMapsApiKey;

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

export async function createProperty(data: any) {
	try {
		const currentUser = await Appwrite.account.get();
		const preparedImage = prepareImageForStorage(data?.image[0]);

		const uploadedImage = await uploadWithRetry(
			addImageToStorage,
			preparedImage
		);
		const resultGallery = await createGallery(uploadedImage!);

		const resultProperty = await Appwrite.databases.createDocument(
			Appwrite.config.databaseId!,
			Appwrite.config.propertiesCollectionId!,
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

		return resultProperty; 
	} catch (error) {
		console.error('Property not created', error);
		return null;
	}
}

export async function addImageToStorage(file: {
	uri: string;
	name: string;
	type: string;
	size: number;
}): Promise<{ fileId: string; url: string } | null> {
	try {
		const isValidExt = (name: string): boolean => {
			const ext = name.split('.').pop()?.toLowerCase();
			return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
		};

		if (file.name && !isValidExt(file.name)) {
			throw new Error('Unsupported file type. Only JPG and PNG allowed.');
		}

		const uploaded = await Appwrite.storage.createFile({
			bucketId: Appwrite.config.bucketId!,
			fileId: ID.unique(),
			file,
			permissions: ['read("any")'],
		});

		const fileId = uploaded.$id;
		const url = `${Appwrite.config.endpoint!}/storage/buckets/${Appwrite.config.bucketId}/files/${fileId}/view?project=${Appwrite.config.projectId}`;

		return { fileId, url };
	} catch (error) {
		console.error('Image upload error:', error);
		return null;
	}
}

export async function createLike(propertyId: string) {
	try {
		const authUser = await Appwrite.account.get();

		const user = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.usersCollectionId!,
			[Query.equal('authId', authUser.$id)]
		);

		const result = await Appwrite.databases.createDocument(
			Appwrite.config.databaseId!,
			Appwrite.config.likesCollectionId!,
			ID.unique(),
			{
				owner: user.documents[0].$id,
				property: propertyId,
			}
		);

		return result;
	} catch (error) {
		console.error('Like not created error:', error);
		return null;
	}
}

export async function updateMyProperty(data: any) {
	const property = await getPropertyById({ id: data?.$id });

	const oldImage = property?.image?.[0]?.image;
	const newImage = data?.image?.[0];
	const oldImageId = oldImage?.fileId;

	const currentImageId =
		'image' in (newImage || {}) ? newImage.image.fileId : null;
	const isImageChanged = oldImageId !== currentImageId;

	if (!isImageChanged) {
		try {
			const result = await Appwrite.databases.updateDocument(
				Appwrite.config.databaseId!,
				Appwrite.config.propertiesCollectionId!,
				data.$id,
				{ ...data, image: [property?.image?.[0].$id] }
			);

			return result;
		} catch (error) {
			console.error('Property not updated', error);
			return null;
		}
	}

	try {
		const preparedImage = prepareImageForStorage(newImage);
		const uploadedNewImage = await uploadWithRetry(
			addImageToStorage,
			preparedImage
		);

		if (!uploadedNewImage) throw new Error('Upload failed');

		try {
			const resultGallery = await createGallery(uploadedNewImage);

			try {
				await deleteGallery(property.image[0].$id);
			} catch (deleteError) {
				console.warn("Couldn't delete old gallery record", deleteError);
			}

			const result = await Appwrite.databases.updateDocument(
				Appwrite.config.databaseId!,
				Appwrite.config.propertiesCollectionId!,
				data.$id,
				{ ...data, image: [resultGallery?.$id] }
			);

			if (result && oldImageId) {
				await deleteImageFromStorageWithRetry(oldImageId);
			}

			return result;
		} catch (dbError) {
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
				continue; 
			}

			await Appwrite.databases.deleteDocument(
				Appwrite.config.databaseId!,
				Appwrite.config.propertiesCollectionId!,
				id
			);

			console.log(`Property ${id} deleted successfully (DB + Storage).`);
			results.push({ id, success: true });
		} catch (error) {
			console.error(`Failed to delete property ${id}:`, error);
			results.push({ id, success: false });
		}
	}

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
		const imageDeleted = await deleteImageFromStorageWithRetry(imageId);
		if (!imageDeleted) {
			console.warn(
				`Property ${id} NOT deleted: failed to delete image ${imageId}.`
			);
			return false;
		}

		const likes = await getLikesByProperty(id);

		await Appwrite.databases.deleteDocument(
			Appwrite.config.databaseId!,
			Appwrite.config.propertiesCollectionId!,
			id
		);

		for (const like of likes!) {
			await deleteLike(like.$id);
		}

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
			await Appwrite.storage.deleteFile(Appwrite.config.bucketId!, imageId);
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

export async function countLikesForProperty(propertyId: string) {
	try {
		const result = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.likesCollectionId!,
			[Query.equal('property', propertyId), Query.limit(1)]
		);

		return result.total;
	} catch (error) {
		console.error('Error getting likes for property:', error);
		return 0;
	}
}

export async function deleteLike(likeId: string) {
	try {
		const result = await Appwrite.databases.deleteDocument(
			Appwrite.config.databaseId!,
			Appwrite.config.likesCollectionId!,
			likeId
		);

		console.log('deleteLike(): Like deleted successfully!');

		return result;
	} catch (error) {
		console.error('Like not deleted error:', error);
		return null;
	}
}

export async function deleteLikes(likes: any[]) {
	try {
		const deletedIds: string[] = [];

		for (const like of likes) {
			await Appwrite.databases.deleteDocument(
				Appwrite.config.databaseId!,
				Appwrite.config.likesCollectionId!,
				like.$id
			);
			deletedIds.push(like.$id); 
		}

		console.log('deleteLikes(): Deleted likes:', deletedIds);
		return { success: true, deletedIds };
	} catch (error) {
		console.error('deleteLikes() error:', error);
		return { success: false, error };
	}
}
