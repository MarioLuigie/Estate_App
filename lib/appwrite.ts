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
// import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
// import { openAuthSessionAsync } from 'expo-web-browser';
import { arrayBufferToBase64 } from '@/tools';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

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

// export const client = new Client();
// client
// 	.setEndpoint(config.endpoint!)
// 	.setProject(config.projectId!)
// 	.setPlatform(config.platform!);

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

// export async function login() {
//   try {
//     // Pobieramy projectId z app.json
//     const projectId = Constants.expoConfig?.extra?.auth?.appwriteProjectId || 'YOUR_PROJECT_ID';

//     // Schemat dla Dev Build / Standalone
//     const scheme = `appwrite-callback-${projectId}`;

//     // Tworzymy poprawny redirect URI w zależności od środowiska
//     const redirectUri =
//       Constants.executionEnvironment === 'storeClient'
//         ? makeRedirectUri({ scheme })  // Dev Build / standalone
//         : makeRedirectUri({ preferLocalhost: true }); // Expo Go

//     console.log('Redirect URI użyty do OAuth:', redirectUri);
//     console.log('FUNCTION_1:', redirectUri);

//     // Generujemy link OAuth w Appwrite
//     const oauthUrl = account.createOAuth2Token({
//       provider: OAuthProvider.Google,
//       success: redirectUri,
//       failure: redirectUri,
//     });

//     if (!oauthUrl) throw new Error('Nie udało się wygenerować oauthUrl');

//     // Otwieramy przeglądarkę / WebBrowser
//     const result = await WebBrowser.openAuthSessionAsync(oauthUrl.toString(), scheme);

//     if (result.type !== 'success') throw new Error('OAuth login anulowany');

//     // Pobieramy secret i userId z redirecta
//     const url = new URL(result.url);
//     const secret = url.searchParams.get('secret');
//     const userId = url.searchParams.get('userId');

//     if (!secret || !userId) throw new Error('Brak secret albo userId');

//     // Tworzymy sesję Appwrite
//     await account.createSession({ userId, secret });

//     console.log('Login zakończony sukcesem');
//     return true;
//   } catch (error) {
//     console.error('OAuth login error', error);
//     return false;
//   }
// }

// EXPO  go DZIALA
// export async function login() {
//   try {
//     // Tworzymy poprawny redirect URI
//     const projectId = Constants.expoConfig?.extra?.auth?.appwriteProjectId || config.projectId;
//     const scheme = `appwrite-callback-${projectId}`;

//     // makeRedirectUri tworzy URI zgodne z Expo Go / Dev Build / Standalone
//     const redirectUri = makeRedirectUri({
//       scheme,
//       preferLocalhost: true, // potrzebne dla dev server
//     });

//     console.log('Redirect URI użyty do OAuth:', redirectUri);
//     console.log('FUNCTION_2:', redirectUri);

//     // Generujemy link OAuth
//     const oauthUrl = account.createOAuth2Token({
//       provider: OAuthProvider.Google,
//       success: redirectUri,
//       failure: redirectUri,
//     });

//     if (!oauthUrl) throw new Error('Nie udało się wygenerować oauthUrl');

//     // Otwieramy sesję w przeglądarce
//     const result = await WebBrowser.openAuthSessionAsync(oauthUrl.toString(), `${scheme}://`);

//     if (result.type !== 'success') throw new Error('OAuth login anulowany');

//     // Pobieramy secret i userId z redirecta
//     const url = new URL(result.url);
//     const secret = url.searchParams.get('secret');
//     const userId = url.searchParams.get('userId');

//     if (!secret || !userId) throw new Error('Brak secret albo userId');

//     // Tworzymy sesję Appwrite
//     await account.createSession({ userId, secret });

//     return true;
//   } catch (error) {
//     console.error('OAuth login error', error);
//     return false;
//   }
// }

// export async function login() {
// 	try {
// 		// Project ID z Appwrite (ten sam co w app.json -> extra.eas.projectId)
// 		const projectId =
// 			Constants.expoConfig?.extra?.eas?.projectId || "aef3a0fb-3c0a-4f80-a3e3-d7ec8cb8a5b3";
// 		const scheme = `appwrite-callback-${projectId}`;

// 		// generujemy poprawny redirect URI (działa w Expo Go i Dev Build)
// 		const redirectUri = makeRedirectUri({
// 			scheme,
// 			preferLocalhost: true,
// 		});

// 		console.log('Redirect URI użyty do OAuth:', redirectUri);
// 		console.log('Function_3', redirectUri);

// 		// pobieramy link do logowania
// 		const oauthUrl = account.createOAuth2Token({
// 			provider: OAuthProvider.Google,
// 			success: redirectUri,
// 			failure: redirectUri,
// 		});

// 		if (!oauthUrl) throw new Error('Nie udało się wygenerować oauthUrl');

// 		// odpalamy sesję w przeglądarce
// 		const result = await WebBrowser.openAuthSessionAsync(
// 			oauthUrl.toString(),
// 			redirectUri
// 		);

// 		if (result.type !== 'success') throw new Error('OAuth login anulowany');

// 		const url = new URL(result.url);
// 		const secret = url.searchParams.get('secret');
// 		const userId = url.searchParams.get('userId');

// 		if (!secret || !userId) throw new Error('Brak secret albo userId');

// 		const session = await account.createSession({ userId, secret });
// 		if (!session) throw new Error('Nie udało się utworzyć sesji');

// 		return true;
// 	} catch (error) {
// 		console.error('OAuth login error', error);
// 		return false;
// 	}
// }

// export async function login() {
// 	try {
// 		// const redirectUri = Linking.createURL('/'); // returned exp://192.168.0.17:8081/--/

// 		const redirectUri =
// 			Constants.executionEnvironment === 'storeClient'
// 				? Linking.createURL('/') // Expo Go
// 				: `appwrite-callback-${config.projectId}`; // Dev Build / standalone

// 		console.log(redirectUri);

// 		// const response = await account.createOAuth2Token(
// 		// 	OAuthProvider.Google,
// 		// 	redirectUri
// 		// );
// 		const oauthUrl = account.createOAuth2Token({
// 			provider: OAuthProvider.Google,
// 			success: redirectUri,
// 			failure: redirectUri,
// 		});
// 		// if (!response) throw new Error('Create OAuth2 token failed');
// 		if (!oauthUrl) throw new Error('Create OAuth2 token failed');

// 		// const browserResult = await openAuthSessionAsync(
// 		// 	response.toString(),
// 		// 	redirectUri
// 		// );
// 		const browserResult = await openAuthSessionAsync(
// 			oauthUrl.toString(),
// 			redirectUri
// 		);
// 		if (browserResult.type !== 'success')
// 			throw new Error('Create OAuth2 token failed');

// 		const url = new URL(browserResult.url);
// 		const secret = url.searchParams.get('secret')?.toString();
// 		const userId = url.searchParams.get('userId')?.toString();
// 		if (!secret || !userId) throw new Error('Create OAuth2 token failed');

// 		// const session = await account.createSession(userId, secret);
// 		const session = await account.createSession({
// 			userId,
// 			secret,
// 		});
// 		if (!session) throw new Error('Failed to create session');

// 		return true;
// 	} catch (error) {
// 		console.error("OAuth login error", error);
// 		return false;
// 	}
// }

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
