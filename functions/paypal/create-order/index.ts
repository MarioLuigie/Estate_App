import { getAccessToken } from '../utils/paypalAuth';

interface CreateOrderInput {
	amount: number;
	currency: string;
	bookingId: string;
	returnUrl?: string;
	cancelUrl?: string;
}

export default async function createOrder(event: any, context: any) {
	try {
		// fallback: event.body może być undefined w React Native SDK
		const bodyStr = event.body || event.payload || '{}';
		const { amount, currency, bookingId, returnUrl, cancelUrl } = JSON.parse(
			bodyStr
		) as CreateOrderInput;

		// walidacja
		if (typeof amount !== 'number')
			throw new Error(`Invalid amount: ${amount}`);
		if (!currency) throw new Error(`Invalid currency: ${currency}`);
		if (!bookingId) throw new Error(`Missing bookingId`);

		// pobieramy token PayPal
		const accessToken = await getAccessToken();
		if (!accessToken) throw new Error('No PayPal access token');

		// budujemy zamówienie
		const body = {
			intent: 'CAPTURE',
			purchase_units: [
				{
					amount: { currency_code: currency, value: amount.toFixed(2) },
					custom_id: bookingId,
				},
			],
			application_context: {
				return_url: returnUrl ?? process.env.PAYPAL_RETURN_URL,
				cancel_url: cancelUrl ?? process.env.PAYPAL_CANCEL_URL,
			},
		};

		// wywołanie PayPal API
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
			body: JSON.stringify(data),
		};
	} catch (err: any) {
		console.error('Error in create-order:', err);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: err.message }),
		};
	}
}
