import { getAccessToken } from '../utils/paypalAuth';

interface CaptureOrderInput {
	orderId: string;
}


export default async function captureOrder(event: any, context: any) {
  const { orderId } = JSON.parse(event.body) as CaptureOrderInput;
  
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

	// Tutaj można też zapisać do bazy Appwrite status płatności
	return {
		statusCode: 200,
		body: JSON.stringify(data),
	};
}
