export enum ActionTypes {
	CREATE = 'Create',
	UPDATE = 'Update',
}

export enum Status {
	CONFIRMED = 'confirmed',
	CANCELLED = 'cancelled',
	PENDING = 'pending',
}

export enum PaymentMethod {
	PAYPAL = 'paypal',
	STRIPE = 'stripe',
}

export enum ContactMethod {
	SMS = 'sms',
	PHONE = 'phone',
	EMAIL = 'email',
}
