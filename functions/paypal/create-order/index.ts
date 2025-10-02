import { getAccessToken } from '../utils/paypalAuth';
import { databases, ID } from '../../appwrite-client/index';
import { Models, Account, Client } from 'node-appwrite';

interface CreateOrderInput {
	startDate: Date | null;
	endDate: Date | null;
	property: string;
	totalPrice: number;
	fullName: string;
	email: string;
	phone: string;
	paymentMethod: string;
	createdAt: string;
	status: string;
	currency?: string;
	returnUrl?: string;
	cancelUrl?: string;
	jwt: Models.Jwt;
}

export default async function createOrder(event: any, context: any) {
	try {
		const rawInput = event.req.body || '{}';
		const parsed = JSON.parse(rawInput) as CreateOrderInput;

		// auth user
		// wyciągam sam token string
		const jwtString = parsed.jwt.jwt; // zamiast JSON.parse(event.req.body.jwt)
		// buduje klienta z JWT
		const client = new Client()
			.setEndpoint(process.env.APPWRITE_ENDPOINT!)
			.setProject(process.env.APPWRITE_PROJECT_ID!)
			.setJWT(jwtString);

		const account = new Account(client);
		const authUser = await account.get();

		const {
			property,
			totalPrice,
			startDate,
			endDate,
			paymentMethod,
			fullName,
			email,
			phone,
			currency = 'USD',
			returnUrl,
			cancelUrl,
		} = parsed;

		// loguje co naprawdę mamy
		console.log('Parsed input:', parsed);

		// const { amount, currency, bookingId, returnUrl, cancelUrl } =
		// 	parsed.data as CreateOrderInput;

		// walidacja
		// if (typeof amount !== 'number')
		// 	throw new Error(`Invalid amount: ${amount}`);
		// if (!currency) throw new Error(`Invalid currency: ${currency}`);
		// if (!bookingId) throw new Error(`Missing bookingId`);

		// tworze dokument booking w DB
		const bookingDoc = await databases.createDocument(
			process.env.APPWRITE_DATABASE_ID!,
			process.env.APPWRITE_BOOKINGS_COLLECTION_ID!,
			ID.unique(),
			{
				ownerId: authUser.$id,
				property,
				totalPrice,
				startDate,
				endDate,
				status: 'pending',
				paymentMethod,
				fullName,
				email,
				phone,
				transactionId: '',
				createdAt: new Date().toISOString(),
			}
		);

		const bookingId = bookingDoc.$id;

		// pobieram token PayPal
		const accessToken = await getAccessToken();
		if (!accessToken) throw new Error('No PayPal access token');

		// buduje zamówienie
		const body = {
			intent: 'CAPTURE',
			purchase_units: [
				{
					amount: {
						currency_code: currency,
						value: totalPrice.toFixed(2),
					},
					custom_id: bookingId,
				},
			],
			application_context: {
				return_url: returnUrl ?? process.env.PAYPAL_RETURN_URL,
				cancel_url: cancelUrl ?? process.env.PAYPAL_CANCEL_URL,
			},
		};

		// wywołołuje PayPal API
		const response = await fetch(
			'https://api-m.sandbox.paypal.com/v2/checkout/orders',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(body),
			}
		);

		const data = await response.json();

		console.log('PayPal create order response:', data);

		return {
			statusCode: 200,
			body: JSON.stringify({
				paypalOrder: data,
				bookingId,
			}),
		};
	} catch (err: any) {
		console.error('Error in create-order:', err);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: err.message }),
		};
	}
}
