import { getAccessToken } from '../utils/paypalAuth';
import { databases } from '../../appwrite-client/index';

interface CaptureOrderInput {
	orderId: string;
}

export default async function captureOrder(event: any, context: any) {
	try {
		const rawInput = event.req.body || '{}';
		const parsed = JSON.parse(rawInput) as CaptureOrderInput;
		const { orderId } = parsed;

		if (!orderId) throw new Error('Missing orderId in captureOrder');

		const accessToken = await getAccessToken();

		const response = await fetch(
			`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const data = await response.json();
		console.log('PayPal capture response:', data);
		// Tutaj można też zapisać do bazy Appwrite status płatności

		// sprawdzamy status
		if (data.status !== 'COMPLETED') {
			throw new Error(`Payment not completed. Status: ${data.status}`);
		}

		// pobieramy bookingId z custom_id
		const bookingId =
			data.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id ??
			data.purchase_units?.[0]?.custom_id;

		if (!bookingId)
			throw new Error('No bookingId (custom_id) in PayPal response');

		// aktualizacja bookingu w DB
		await databases.updateDocument(
			process.env.APPWRITE_DATABASE_ID!,
			process.env.APPWRITE_BOOKINGS_COLLECTION_ID!,
			bookingId,
			{
				status: 'confirmed',
				transactionId: orderId,
				// paypalResponse: data, // można trzymać całą odpowiedź PayPal do audytu
			}
		);

		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				bookingId,
				paypal: data,
			}),
		};
	} catch (err: any) {
		console.error('Error in capture-order:', err);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: err.message }),
		};
	}
}
