// lib
import { ActionTypes } from './enums';
import icons from './icons';
import images from './images';
import { ROUTES } from './paths';

export const cards = [
	{
		title: 'Card 1',
		location: 'Location 1',
		price: '$100',
		rating: 4.8,
		category: 'house',
		image: images.newYork,
	},
	{
		title: 'Card 2',
		location: 'Location 2',
		price: '$200',
		rating: 3,
		category: 'house',
		image: images.japan,
	},
	{
		title: 'Card 3',
		location: 'Location 3',
		price: '$300',
		rating: 2,
		category: 'flat',
		image: images.newYork,
	},
	{
		title: 'Card 4',
		location: 'Location 4',
		price: '$400',
		rating: 5,
		category: 'villa',
		image: images.japan,
	},
];

export const featuredCards = [
	{
		title: 'Featured 1',
		location: 'Location 1',
		price: '$100',
		rating: 4.8,
		image: images.newYork,
		category: 'house',
	},
	{
		title: 'Featured 2',
		location: 'Location 2',
		price: '$200',
		rating: 3,
		image: images.japan,
		category: 'flat',
	},
];

export const categories = [
	{ title: 'All', category: 'All' },
	{ title: 'Houses', category: 'House' },
	{ title: 'Condos', category: 'Condo' },
	{ title: 'Duplexes', category: 'Duplex' },
	{ title: 'Studios', category: 'Studio' },
	{ title: 'Villas', category: 'Villa' },
	{ title: 'Apartments', category: 'Apartment' },
	{ title: 'Townhouses', category: 'Townhouse' },
	{ title: 'Others', category: 'Other' },
];

export const types = [
	{ title: 'Houses', type: 'House' },
	{ title: 'Condos', type: 'Condo' },
	{ title: 'Duplexes', type: 'Duplex' },
	{ title: 'Studios', type: 'Studio' },
	{ title: 'Villas', type: 'Villa' },
	{ title: 'Apartments', type: 'Apartment' },
	{ title: 'Townhouses', type: 'Townhouse' },
	{ title: 'Others', type: 'Other' },
];

export const settings = [
	{
		title: 'My Bookings',
		icon: icons.calendar,
		path: ROUTES.PROFILE_MY_BOOKINGS,
	},
	{
		title: 'My Properties',
		icon: icons.wallet,
		path: ROUTES.PROFILE_MY_PROPERTIES,
	},
	{
		title: 'Profile',
		icon: icons.person,
		path: ROUTES.PROFILE_SETTINGS_PROFILE,
	},
	{
		title: 'Notifications',
		icon: icons.bell,
		path: ROUTES.PROFILE_SETTINGS_NOTIFICATIONS,
	},
	{
		title: 'Payments',
		icon: icons.wallet,
		path: ROUTES.PROFILE_SETTINGS_PAYMENTS,
	},
	{
		title: 'Security',
		icon: icons.shield,
		path: ROUTES.PROFILE_SETTINGS_SECURITY,
	},
	{
		title: 'Help Center',
		icon: icons.info,
		path: ROUTES.PROFILE_SETTINGS_HELP_CENTER,
	},
];

export const facilities = [
	{
		title: 'Laundry',
		icon: icons.laundry,
		facility: 'Laundry',
	},
	{
		title: 'Parking',
		icon: icons.carPark,
		facility: 'Parking',
	},
	{
		title: 'Sports Center',
		icon: icons.run,
		facility: 'Sports-center',
	},
	{
		title: 'Cutlery',
		icon: icons.cutlery,
		facility: 'Cutlery',
	},
	{
		title: 'Gym',
		icon: icons.dumbell,
		facility: 'Gym',
	},
	{
		title: 'Swimming pool',
		icon: icons.swim,
		facility: 'Swimming-pool',
	},
	{
		title: 'Wifi',
		icon: icons.wifi,
		facility: 'Wifi',
	},
	{
		title: 'Pet Center',
		icon: icons.dog,
		facility: 'Pet-friendly',
	},
];

export const gallery = [
	{
		id: 1,
		image: images.newYork,
	},
	{
		id: 2,
		image: images.japan,
	},
	{
		id: 3,
		image: images.newYork,
	},
	{
		id: 4,
		image: images.japan,
	},
	{
		id: 5,
		image: images.newYork,
	},
	{
		id: 6,
		image: images.japan,
	},
];

export const PROPERTY_FORM_DEFAULT_VALUES = {
	name: '',
	type: '',
	description: '',
	address: '',
	latitude: 37.78825,
	longitude: -122.4324,
	price: 1000,
	area: 500,
	bedrooms: 1,
	bathrooms: 1,
	rating: 3,
	facilities: [],
	image: [],
	ownerId: '',
	gallery: [],
	reviews: [],
	agent: '',
	geolocation: '',
};

export function getPropertyFormDefaultValues(
	actionType: ActionTypes,
	property: any | null | undefined
) {
	if (actionType === ActionTypes.CREATE) {
		return PROPERTY_FORM_DEFAULT_VALUES;
	}

	if (actionType === ActionTypes.UPDATE && property) {
		return property;
	}
	return PROPERTY_FORM_DEFAULT_VALUES;
}
