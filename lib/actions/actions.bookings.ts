// modules
import {
  Query,
} from 'react-native-appwrite';
// lib
import * as Appwrite from '@/lib/services/appwrite';

// READ BOOKINGS
export async function getMyBookings() {
  try {
    const authUser = await Appwrite.account.get();

    const result = Appwrite.databases.listDocuments(
      Appwrite.config.databaseId!,
      Appwrite.config.bookingsCollectionId!,
      [Query.equal('ownerId', authUser.$id)]
    )

    return (await result).documents;
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
      data,
      [] // permissions
    );

    return result;
  } catch (error) {
    console.error('Bookings not founded error:', error);
    return null;
  }
}