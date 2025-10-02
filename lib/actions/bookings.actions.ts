// modules
import { ID, Query } from 'react-native-appwrite';
import Constants from 'expo-constants';
// lib
import * as Appwrite from '@/lib/services/appwrite';
import * as Mock from '@/lib/actions/mock/bookings.mock';
import { Mode } from '@/lib/constants/enums';

const USE_API = Constants.expoConfig?.extra?.auth?.NODE_ENV === Mode.PRODUCTION;

// READ BOOKINGS
export async function getMyBookings() {
	try {
		if (USE_API) {
			const authUser = await Appwrite.account.get();

			const result = await Appwrite.databases.listDocuments(
				Appwrite.config.databaseId!,
				Appwrite.config.bookingsCollectionId!,
				[Query.equal('ownerId', authUser.$id), Query.orderDesc('$createdAt')]
			);

			console.log("getMyBookings:", result.documents)

			return result.documents;
		} else {
			return await Mock.getMyBookings();
		}
	} catch (error) {
		console.error('Bookings not founded error:', error);
		return null;
	}
}

export async function getBookingsByPropertyId(propertyId: string) {
	try {
		const result = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.bookingsCollectionId!,
			[Query.equal('property', propertyId)]
		);

		return result.documents;
	} catch (error) {
		console.error('Bookings not founded error:', error);
		return null;
	}
}

// CREATE BOOKING
export async function createBooking(data: any) {
	try {
		const result = await Appwrite.databases.createDocument(
			Appwrite.config.databaseId!,
			Appwrite.config.bookingsCollectionId!,
      ID.unique(),
			data,
			[] // permissions
		);

		return result;
	} catch (error) {
		console.error('Bookings not founded error:', error);
		return null;
	}
}
