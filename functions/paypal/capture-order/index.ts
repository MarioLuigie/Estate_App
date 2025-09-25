import { Client, Databases } from 'node-appwrite';

const client = new Client()
	.setEndpoint(process.env.APPWRITE_ENDPOINT!)
	.setProject(process.env.APPWRITE_PROJECT_ID!)
	.setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

interface CaptureOrderInput {
	orderId: string;
}

export default async function captureOrder(event: any) {
	const { orderId } = JSON.parse(event.body) as CaptureOrderInput;

	const response = await fetch(
		`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
			},
		}
	);

	const data = await response.json();
	return {
		statusCode: 200,
		body: JSON.stringify(data),
	};
}
