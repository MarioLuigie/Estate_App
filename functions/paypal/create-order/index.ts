import { getAccessToken } from "../utils/paypalAuth";

interface CreateOrderInput {
  amount: number;
  currency: string;
  bookingId: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export default async function createOrder(event: any, context: any) {
  const { amount, currency, bookingId, returnUrl, cancelUrl } = JSON.parse(event.body) as CreateOrderInput;

  const accessToken = await getAccessToken();

  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: { currency_code: currency, value: amount.toFixed(2) },
        custom_id: bookingId
      }
    ],
    application_context: {
      return_url: returnUrl ?? process.env.PAYPAL_RETURN_URL,
      cancel_url: cancelUrl ?? process.env.PAYPAL_CANCEL_URL
    }
  };

  const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

