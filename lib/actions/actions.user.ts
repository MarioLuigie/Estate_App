// modules
import {
  Query,
} from 'react-native-appwrite';
// lib
import * as Appwrite from '@/lib/services/appwrite';
import {
  arrayBufferToBase64,
} from '@/lib/utils/';

// READ USER
export async function getCurrentAuthUser() {
  try {
    const result = await Appwrite.account.get();
    if (result.$id) {
      // const userAvatar = avatar.getInitials(result.name);
      // Now Arg for getInitilas is the object with prop name, not string
      let avatarBase64: string | undefined;

      try {
        const buffer = await Appwrite.avatar.getInitials({
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

export async function getCurrentUser({ authId }: { authId: string }) {
  try {
    const result = await Appwrite.databases.listDocuments(
      Appwrite.config.databaseId!,
      Appwrite.config.usersCollectionId!,
      [Query.equal('authId', authId)]
    );

    return result.documents[0];
  } catch (error) {
    console.error('Unexpected error-current user not found:', error);
    return null;
  }
}