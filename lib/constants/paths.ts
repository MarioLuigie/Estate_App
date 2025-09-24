export const ROUTES = {
	// login routes
	SIGN_IN: '/sign-in' as const,
	// main tabs routes
	HOME: '/' as const,
	EXPLORE: '/explore' as const,
	PROFILE: '/profile' as const,
	// profile routes
	PROFILE_MY_BOOKINGS: '/profile/my-bookings' as const,
	PROFILE_MY_PROPERTIES: '/profile/my-properties' as const,
	PROFILE_SETTINGS_PROFILE: '/profile/settings/profile' as const,
	PROFILE_SETTINGS_NOTIFICATIONS: '/profile/settings/notifications' as const,
	PROFILE_SETTINGS_PAYMENTS: '/profile/settings/payments' as const,
	PROFILE_SETTINGS_SECURITY: '/profile/settings/security' as const,
	PROFILE_SETTINGS_HELP_CENTER: '/profile/settings/help-center' as const,
	// properties routes
	PROPERTIES: '/properties' as const,
	PROPERTIES_ADD: '/properties/add' as const,
	PROPERTIES_ADD_PROPERTY: '/properties/add/add-property' as const,
	PROPERTIES_UPDATE_PROPERTY: '/properties/update' as const,
	// bookings routes
	BOOKINGS: '/bookings' as const,
	BOOKINGS_CHECKOUT_BOOKING: '/bookings/checkout/checkout-booking' as const,
} as const;
