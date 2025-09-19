// modules
import { Asset } from 'expo-asset';
import { ID, Permission, Role } from 'react-native-appwrite';
// lib
import {
	addImageToStorage,
	config,
	createGallery,
	databases,
	getAddressFromCoordinates,
} from '@/lib/actions/appwrite';
import { agentImages, propertiesImages, reviewImages } from '@/lib/data';
import { getRandomCoordinatesNearMajorCities } from '@/lib/tools';
import { PaymentMethod, Status } from '@/lib/constants/enums';

const COLLECTIONS = {
	AGENT: config.agentsCollectionId,
	REVIEWS: config.reviewsCollectionId,
	GALLERY: config.galleriesCollectionId,
	PROPERTY: config.propertiesCollectionId,
	BOOKING: config.bookingsCollectionId,
};

const propertyTypes = [
	'House',
	'Townhouse',
	'Condo',
	'Duplex',
	'Studio',
	'Villa',
	'Apartment',
	'Other',
];

const facilities = ['Laundry', 'Parking', 'Gym', 'Wifi', 'Pet-friendly'];

// function getMimeType(fileName: string) {
// 	const ext = fileName.split('.').pop()?.toLowerCase();
// 	switch (ext) {
// 		case 'jpg':
// 		case 'jpeg':
// 			return 'image/jpeg';
// 		case 'png':
// 			return 'image/png';
// 		default:
// 			return 'image/jpeg';
// 	}
// }

function generateBookingsData(count: number) {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth(); // bieżący miesiąc (0-11)

	const results: { startDate: Date; endDate: Date }[] = [];

	let currentDay = 1;

	for (let i = 0; i < count; i++) {
		const duration = Math.floor(Math.random() * 3) + 2; // 2–4 dni
		const start = new Date(year, month, currentDay);
		const end = new Date(year, month, currentDay + duration);

		results.push({
			startDate: start,
			endDate: end,
		});

		currentDay += duration + 1;
	}

	return results;
}

function getRandomSubset<T>(
	array: T[],
	minItems: number,
	maxItems: number
): T[] {
	if (minItems > maxItems) {
		throw new Error('minItems cannot be greater than maxItems');
	}
	if (minItems < 0 || maxItems > array.length) {
		throw new Error(
			'minItems or maxItems are out of valid range for the array'
		);
	}

	// Generate a random size for the subset within the range [minItems, maxItems]
	const subsetSize =
		Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

	// Create a copy of the array to avoid modifying the original
	const arrayCopy = [...array];

	// Shuffle the array copy using Fisher-Yates algorithm
	for (let i = arrayCopy.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		[arrayCopy[i], arrayCopy[randomIndex]] = [
			arrayCopy[randomIndex],
			arrayCopy[i],
		];
	}

	// Return the first `subsetSize` elements of the shuffled array
	return arrayCopy.slice(0, subsetSize);
}

async function seed() {
	try {
		// Clear existing data from all collections
		for (const key in COLLECTIONS) {
			const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
			const documents = await databases.listDocuments(
				config.databaseId!,
				collectionId!
			);
			for (const doc of documents.documents) {
				await databases.deleteDocument(
					config.databaseId!,
					collectionId!,
					doc.$id
				);
			}
		}

		console.log('Cleared all existing data.');

		// Seed Agents
		const agents = [];
		for (let i = 1; i <= 5; i++) {
			const agent = await databases.createDocument(
				config.databaseId!,
				COLLECTIONS.AGENT!,
				ID.unique(),
				{
					name: `Agent ${i}`,
					email: `agent${i}@example.com`,
					avatar:
						agentImages[Math.floor(Math.random() * agentImages.length)],
				}
			);
			agents.push(agent);
		}
		console.log(`Seeded ${agents.length} agents.`);

		// Seed Reviews
		const reviews = [];
		for (let i = 1; i <= 20; i++) {
			const review = await databases.createDocument(
				config.databaseId!,
				COLLECTIONS.REVIEWS!,
				ID.unique(),
				{
					name: `Reviewer ${i}`,
					avatar:
						reviewImages[Math.floor(Math.random() * reviewImages.length)],
					review: `This is a review by Reviewer ${i}.`,
					rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
				}
			);
			reviews.push(review);
		}
		console.log(`Seeded ${reviews.length} reviews.`);

		// Seed Galleries
		// const galleries = [];
		// for (const image of galleryImages) {
		// 	const gallery = await databases.createDocument(
		// 		config.databaseId!,
		// 		COLLECTIONS.GALLERY!,
		// 		ID.unique(),
		// 		{
		// 			image: JSON.stringify({
		// 				url: image.url,
		// 				fileId: null, // bo przy seedzie nie masz pliku w storage
		// 			}),
		// 		}
		// 	);
		// 	galleries.push(gallery);
		// }

		// console.log(`Seeded ${galleries.length} galleries.`);

		const propertiesIds: string[] = [];
		const ownerIdTest: string = '68cd4b16637286e81627';
		// Seed Properties
		for (let i = 1; i <= 20; i++) {
			const assignedAgent =
				agents[Math.floor(Math.random() * agents.length)];

			const assignedReviews = getRandomSubset(reviews, 5, 7); // 5 to 7 reviews
			// const assignedGalleries = getRandomSubset(galleries, 3, 8); // 3 to 8 galleries

			const selectedFacilities = facilities
				.sort(() => 0.5 - Math.random())
				.slice(0, Math.floor(Math.random() * facilities.length) + 1);

			// Local asset
			const assetObj = propertiesImages[i % propertiesImages.length].asset;
			const localAsset = Asset.fromModule(assetObj);
			await localAsset.downloadAsync();

			// Teraz mamy prawdziwe URI w localUri
			const fileUri = localAsset.localUri;
			if (!fileUri)
				throw new Error(`Asset localUri is missing for index ${i}`);

			// Wyciągamy nazwę pliku z localUri
			const fileNameParts = fileUri.split('/');
			const originalName =
				fileNameParts[fileNameParts.length - 1] || `seed-${i}.jpg`;

			// Obsługa rozszerzeń
			let ext = originalName.split('.').pop()?.toLowerCase();
			if (ext === 'jpeg') ext = 'jpg';
			const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

			const fileToUpload = {
				uri: fileUri,
				name: `seed-${i}.${ext}`,
				type: mimeType,
				size: 0,
			};

			const result = await addImageToStorage(fileToUpload);

			const imageToDb = {
				url: result?.url!,
				fileId: result?.fileId!,
			};

			const resultGallery = await createGallery(imageToDb);

			const coords = getRandomCoordinatesNearMajorCities();
			const address = await getAddressFromCoordinates(
				coords.latitude,
				coords.longitude
			);

			const property = await databases.createDocument(
				config.databaseId!,
				COLLECTIONS.PROPERTY!,
				ID.unique(),
				{
					name: `Property ${i}`,
					type: propertyTypes[
						Math.floor(Math.random() * propertyTypes.length)
					],
					description: `This is the description for Property ${i}.`,
					address: `${address?.street}, ${address?.city}, ${address?.country}`,
					geolocation: `${coords.latitude}, ${coords.longitude}`,
					latitude: coords.latitude,
					longitude: coords.longitude,
					price: Math.floor(Math.random() * 9000) + 1000,
					area: Math.floor(Math.random() * 3000) + 500,
					bedrooms: Math.floor(Math.random() * 5) + 1,
					bathrooms: Math.floor(Math.random() * 5) + 1,
					rating: Math.floor(Math.random() * 5) + 1,
					facilities: selectedFacilities,
					image: [resultGallery?.$id],
					agent: assignedAgent.$id,
					reviews: assignedReviews.map((review) => review.$id),
					gallery: ['68bffaa10007aaf06a7b', '68bffaa00025cfaf074d'], // CORRECT!
					ownerId: ownerIdTest,
					likes: [],
				},
				[
					Permission.read(Role.users()),
					Permission.update(Role.user(ownerIdTest)),
					Permission.delete(Role.user(ownerIdTest)),
				]
			);
			propertiesIds.push(property.$id);
			console.log(`Seeded property: ${property.name}, id: ${property.$id}`);

			await new Promise((r) => setTimeout(r, 200));
		}

		// seed bookings
		const bookingsData = generateBookingsData(6);

		for (let i = 0; i < bookingsData.length; i++) {
			const booking = await databases.createDocument(
				config.databaseId!,
				config.bookingsCollectionId!,
				ID.unique(),
				{
					ownerId: ownerIdTest,
					startDate: bookingsData[i].startDate,
					endDate: bookingsData[i].endDate,
					property: propertiesIds[propertiesIds.length - 1],
					status: i % 2 === 0 ? Status.CANCELLED : Status.CONFIRMED,
					totalPrice: 1000,
					paymentMethod: PaymentMethod.PAYPAL,
					transactionId: '',
					guestDetails: '',
					createdAt: new Date(
						Date.now() -
							Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
					),

					propertySnapshot: '',
				}
			);

			console.log(
				`Seeded booking ${i + 1} with start: ${bookingsData[i].startDate.toLocaleDateString('pl-PL')} end: ${bookingsData[i].endDate.toLocaleDateString('pl-PL')} for property id: ${booking.property}`
			);

			await new Promise((r) => setTimeout(r, 200));
		}

		console.log('Data seeding completed.');
	} catch (error) {
		console.error('Error seeding data:', error);
	}
}

export default seed;

{
	/* last Seed */
}
// // modules
// import { ID, Permission, Role } from 'react-native-appwrite';
// // lib
// import {
// 	agentImages,
// 	galleryImages,
// 	propertiesImages,
// 	reviewImages,
// } from '@/lib/data';
// import { getRandomCoordinatesNearMajorCities } from '@/lib/tools';
// import { config, databases, getAddressFromCoordinates } from '@/lib/appwrite';

// const COLLECTIONS = {
// 	AGENT: config.agentsCollectionId,
// 	REVIEWS: config.reviewsCollectionId,
// 	GALLERY: config.galleriesCollectionId,
// 	PROPERTY: config.propertiesCollectionId,
// };

// const propertyTypes = [
// 	'House',
// 	'Townhouse',
// 	'Condo',
// 	'Duplex',
// 	'Studio',
// 	'Villa',
// 	'Apartment',
// 	'Other',
// ];

// const facilities = ['Laundry', 'Parking', 'Gym', 'Wifi', 'Pet-friendly'];

// function getRandomSubset<T>(
// 	array: T[],
// 	minItems: number,
// 	maxItems: number
// ): T[] {
// 	if (minItems > maxItems) {
// 		throw new Error('minItems cannot be greater than maxItems');
// 	}
// 	if (minItems < 0 || maxItems > array.length) {
// 		throw new Error(
// 			'minItems or maxItems are out of valid range for the array'
// 		);
// 	}

// 	// Generate a random size for the subset within the range [minItems, maxItems]
// 	const subsetSize =
// 		Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

// 	// Create a copy of the array to avoid modifying the original
// 	const arrayCopy = [...array];

// 	// Shuffle the array copy using Fisher-Yates algorithm
// 	for (let i = arrayCopy.length - 1; i > 0; i--) {
// 		const randomIndex = Math.floor(Math.random() * (i + 1));
// 		[arrayCopy[i], arrayCopy[randomIndex]] = [
// 			arrayCopy[randomIndex],
// 			arrayCopy[i],
// 		];
// 	}

// 	// Return the first `subsetSize` elements of the shuffled array
// 	return arrayCopy.slice(0, subsetSize);
// }

// async function seed() {
// 	try {
// 		// Clear existing data from all collections
// 		for (const key in COLLECTIONS) {
// 			const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
// 			const documents = await databases.listDocuments(
// 				config.databaseId!,
// 				collectionId!
// 			);
// 			for (const doc of documents.documents) {
// 				await databases.deleteDocument(
// 					config.databaseId!,
// 					collectionId!,
// 					doc.$id
// 				);
// 			}
// 		}

// 		console.log('Cleared all existing data.');

// 		// Seed Agents
// 		const agents = [];
// 		for (let i = 1; i <= 5; i++) {
// 			const agent = await databases.createDocument(
// 				config.databaseId!,
// 				COLLECTIONS.AGENT!,
// 				ID.unique(),
// 				{
// 					name: `Agent ${i}`,
// 					email: `agent${i}@example.com`,
// 					avatar:
// 						agentImages[Math.floor(Math.random() * agentImages.length)],
// 				}
// 			);
// 			agents.push(agent);
// 		}
// 		console.log(`Seeded ${agents.length} agents.`);

// 		// Seed Reviews
// 		const reviews = [];
// 		for (let i = 1; i <= 20; i++) {
// 			const review = await databases.createDocument(
// 				config.databaseId!,
// 				COLLECTIONS.REVIEWS!,
// 				ID.unique(),
// 				{
// 					name: `Reviewer ${i}`,
// 					avatar:
// 						reviewImages[Math.floor(Math.random() * reviewImages.length)],
// 					review: `This is a review by Reviewer ${i}.`,
// 					rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
// 				}
// 			);
// 			reviews.push(review);
// 		}
// 		console.log(`Seeded ${reviews.length} reviews.`);

// 		// Seed Galleries
// 		const galleries = [];
// 		for (const image of galleryImages) {
// 			const gallery = await databases.createDocument(
// 				config.databaseId!,
// 				COLLECTIONS.GALLERY!,
// 				ID.unique(),
// 				{ image: image.url }
// 			);
// 			galleries.push(gallery);
// 		}

// 		console.log(`Seeded ${galleries.length} galleries.`);

// 		// Seed Properties
// 		for (let i = 1; i <= 20; i++) {
// 			const assignedAgent =
// 				agents[Math.floor(Math.random() * agents.length)];

// 			const assignedReviews = getRandomSubset(reviews, 5, 7); // 5 to 7 reviews
// 			const assignedGalleries = getRandomSubset(galleries, 3, 8); // 3 to 8 galleries

// 			const selectedFacilities = facilities
// 				.sort(() => 0.5 - Math.random())
// 				.slice(0, Math.floor(Math.random() * facilities.length) + 1);

// 			const image =
// 				propertiesImages.length - 1 >= i
// 					? JSON.stringify({
// 							url: propertiesImages[i].url,
// 							fileId: ID.unique(),
// 						})
// 					: JSON.stringify({
// 							url: propertiesImages[
// 								Math.floor(Math.random() * propertiesImages.length)
// 							].url,
// 							fileId: ID.unique(),
// 						});

// 			const coords = getRandomCoordinatesNearMajorCities();
// 			const address = await getAddressFromCoordinates(
// 				coords.latitude,
// 				coords.longitude
// 			);

// 			const property = await databases.createDocument(
// 				config.databaseId!,
// 				COLLECTIONS.PROPERTY!,
// 				ID.unique(),
// 				{
// 					name: `Property ${i}`,
// 					type: propertyTypes[
// 						Math.floor(Math.random() * propertyTypes.length)
// 					],
// 					description: `This is the description for Property ${i}.`,
// 					address: `${address?.street}, ${address?.city}, ${address?.country}`,
// 					geolocation: `${coords.latitude}, ${coords.longitude}`,
// 					latitude: coords.latitude,
// 					longitude: coords.longitude,
// 					price: Math.floor(Math.random() * 9000) + 1000,
// 					area: Math.floor(Math.random() * 3000) + 500,
// 					bedrooms: Math.floor(Math.random() * 5) + 1,
// 					bathrooms: Math.floor(Math.random() * 5) + 1,
// 					rating: Math.floor(Math.random() * 5) + 1,
// 					facilities: selectedFacilities,
// 					image: image,
// 					agent: assignedAgent.$id,
// 					reviews: assignedReviews.map((review) => review.$id),
// 					gallery: assignedGalleries.map((gallery) => gallery.$id),
// 					ownerId:'68b727a34ad1fcc0988b'},
// 				[
// 					Permission.read(Role.users()),
// 					Permission.update(Role.user('68b727a34ad1fcc0988b')),
// 					Permission.delete(Role.user('68b727a34ad1fcc0988b')),
// 				]
// 			);
// 			console.log(`Seeded property: ${property.name}`);
// 		}

// 		console.log('Data seeding completed.');
// 	} catch (error) {
// 		console.error('Error seeding data:', error);
// 	}
// }

// export default seed;
