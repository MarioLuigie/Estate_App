// modules
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import {
	ID,
	OAuthProvider,
	Query,
} from 'react-native-appwrite';
// modules
import * as Appwrite from '@/lib/services/appwrite'

// LOGIN
export async function login() {
	try {
		// --- 1. Rozróżniamy środowisko ---
		const isDev = Constants.executionEnvironment === 'storeClient'; // Expo Go
		const projectId =
			Constants.expoConfig?.extra?.auth?.appwriteProjectId ||
			Appwrite.config?.projectId;
		const scheme = `appwrite-callback-${projectId}`;

		// --- 2. Tworzymy poprawny redirectUri ---
		const redirectUri = isDev
			? makeRedirectUri({ preferLocalhost: true }) // Dev Build / Expo Go
			: makeRedirectUri({ scheme }); // Standalone build

		// console.log('Redirect URI użyty do OAuth:', redirectUri);
		// console.log('FUNCTION_0:', redirectUri);

		// --- 3. Generujemy URL OAuth ---
		const oauthUrl = Appwrite.account.createOAuth2Token({
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

		// ---  TEST Bezpieczne parsowanie URL ---
		// const cleanUrl = result.url.split('#')[0]; // usuń fragment
		// const params = new URLSearchParams(cleanUrl.split('?')[1]);

		// const secret = params.get('secret');
		// const userId = params.get('userId');
		// --- TEST ENDING

		// --- 5. Parsujemy secret i userId z callback URL ---
		const url = new URL(result.url);
		const secret = url.searchParams.get('secret');
		const userId = url.searchParams.get('userId');

		if (!secret || !userId)
			throw new Error('Brak secret albo userId w callback');

		// --- 6. Tworzymy sesję Appwrite ---
		await Appwrite.account.createSession({ userId, secret });

		const currentAuthUser = await Appwrite.account.get();

		// console.log('Callback URL:', result.url);
		// console.log('Secret:', secret, 'UserId:', userId);

		const userDoc = await Appwrite.databases.listDocuments(
			Appwrite.config.databaseId!,
			Appwrite.config.usersCollectionId!,
			[Query.equal('authId', currentAuthUser.$id)]
		);

		if (userDoc.documents.length === 0) {
			await Appwrite.databases.createDocument(
				Appwrite.config.databaseId!,
				Appwrite.config.usersCollectionId!,
				ID.unique(),
				{
					authId: currentAuthUser.$id,
					fullName: currentAuthUser.name,
					email: currentAuthUser.email,
					createdAt: currentAuthUser.$createdAt,
					phone: null,
				}
			);
		}

		console.log('Login zakończony sukcesem');
		return true;
	} catch (error) {
		console.error('OAuth login error', error);
		return false;
	}
}

// LOGOUT
export async function logout() {
	try {
		await Appwrite.account.deleteSession({
			sessionId: 'current',
		});
		// throw new Error();
		return true;
	} catch (error) {
		console.error('Logout error:', error);
		throw error;
	}
}