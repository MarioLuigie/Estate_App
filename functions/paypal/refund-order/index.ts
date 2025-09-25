import { client, databases } from '@/functions/appwrite-client';

interface RefundInput {
  captureId: string;
  amount: number;
  currency: string;
}

export default async function refundOrder(event: any) {
  const { captureId, amount, currency } = JSON.parse(event.body) as RefundInput;

  const response = await fetch(`https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      amount: {
        value: amount.toFixed(2),
        currency_code: currency
      }
    })
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
