import { client, databases } from '@/functions/appwrite-client';

interface CaptureOrderInput {
  orderId: string;
}

export default async function captureOrder(event: any, context: any) {
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

  // Tutaj można też zapisać do bazy Appwrite status płatności
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
