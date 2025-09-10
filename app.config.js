import 'dotenv/config';

export default {
	"expo": {
		"name": "estate_app",
		"slug": "estate_app",
		"version": "1.0.0",
		"orientation": "portrait",
		"icon": "./assets/images/icon.png",
		"scheme": `appwrite-callback-${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID}`,
		"userInterfaceStyle": "automatic",
		"newArchEnabled": false,
		"ios": {
			"supportsTablet": true,
			"infoPlist": {
				"NSPhotoLibraryUsageDescription": "This app needs access to your photo library to upload images.",
				"NSCameraUsageDescription": "This app needs access to your camera to take photos.",
				"NSAppTransportSecurity": {
					"NSAllowsArbitraryLoads": true // pozwala na HTTP
				}
			}
		},
		"android": {
			"permissions": [
				"CAMERA",
				"READ_EXTERNAL_STORAGE",
				"WRITE_EXTERNAL_STORAGE",
				"INTERNET"
			],
			"package": "com.mlotocki.estate",
			"adaptiveIcon": {
				"foregroundImage": "./assets/images/icon.png",
				"backgroundColor": "#ffffff"
			},
			"edgeToEdgeEnabled": true,
			"config": {
				"googleMaps": {
					"apiKey": process.env.GOOGLE_MAPS_API_KEY
				}
			}
		},
		"web": {
			"bundler": "metro",
			"output": "static",
			"favicon": "./assets/images/favicon.png"
		},
		"plugins": [
			[
				"expo-build-properties",
				{
					"android": {
						"usesCleartextTraffic": true,
					},
					"ios": {
						"useFrameworks": "static"
					}
				}
			],
			"expo-router",
			[
				"expo-splash-screen",
				{
					"image": "./assets/images/splash-icon.png",
					"resizeMode": "cover",
					"backgroundColor": "#ffffff",
					"enableFullScreenImage_legacy": true
				}
			],
			[
				"expo-image-picker",
				{
					"photosPermission": "The app accesses your photos to let you share them with your friends."
				}
			],
			[
				"expo-font",
				{
					"fonts": [
						"./assets/fonts/Rubik-Bold.ttf",
						"./assets/fonts/Rubik-ExtraBold.ttf",
						"./assets/fonts/Rubik-Light.ttf",
						"./assets/fonts/Rubik-Medium.ttf",
						"./assets/fonts/Rubik-Regular.ttf",
						"./assets/fonts/Rubik-SemiBold.ttf"
					]
				}
			],
			"expo-maps"
		],
		"experiments": {
			"typedRoutes": true
		},
		"extra": {
			"router": {},
			"eas": {
				"projectId": "aef3a0fb-3c0a-4f80-a3e3-d7ec8cb8a5b3"
			},
			"auth": {
				"appwriteProjectId": process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
				"redirectScheme": `appwrite-callback-${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID}`,
				"appwriteEndpoint": process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
				"appwriteDatabaseId": process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
				"galleriesCollectionId": process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
				"reviewsCollectionId": process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
				"agentsCollectionId": process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
				"propertiesCollectionId": process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
				'bucketId': process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
				"googleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY,
			}
		}
	}
}
