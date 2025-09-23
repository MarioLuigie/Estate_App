// modules
import { ID, Permission, Role } from 'react-native-appwrite';
// modules
import * as Appwrite from '@/lib/services/appwrite';

// CREATE GALLERY
export async function createGallery(data: { url: string; fileId: string }) {
	try {
		const currentUser = await Appwrite.account.get();
		const result = await Appwrite.databases.createDocument(
			Appwrite.config.databaseId!,
			Appwrite.config.galleriesCollectionId!,
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
// DELETE GALLERY
export async function deleteGallery(id: string) {
	try {
		const result = await Appwrite.databases.deleteDocument(
			Appwrite.config.databaseId!,
			Appwrite.config.galleriesCollectionId!,
			id
		);

		return result;
	} catch (error) {
		console.error('Property not created', error);
		return null;
	}
}


