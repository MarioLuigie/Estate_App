import { client, databases } from '@/functions/appwrite-client';

interface CreateOrderInput {
  amount: number;
  currency: string;
  bookingId: string;
}

export default async function createOrder(event: any, context: any) {
  const { amount, currency, bookingId } = JSON.parse(event.body) as CreateOrderInput;

  const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: currency, value: amount.toFixed(2) },
          custom_id: bookingId
        }
      ]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
