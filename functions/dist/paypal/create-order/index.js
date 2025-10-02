"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createOrder;
const paypalAuth_1 = require("../utils/paypalAuth");
const index_1 = require("../../appwrite-client/index");
async function createOrder(event, context) {
    try {
        // auth user
        const authUser = await index_1.account.get();
        const rawInput = event.req.body || '{}';
        const parsed = JSON.parse(rawInput);
        const { property, totalPrice, startDate, endDate, paymentMethod, fullName, email, phone, currency = 'USD', returnUrl, cancelUrl, } = parsed;
        // logujemy co naprawdę mamy
        console.log('Parsed input:', parsed);
        // const { amount, currency, bookingId, returnUrl, cancelUrl } =
        // 	parsed.data as CreateOrderInput;
        // walidacja
        // if (typeof amount !== 'number')
        // 	throw new Error(`Invalid amount: ${amount}`);
        // if (!currency) throw new Error(`Invalid currency: ${currency}`);
        // if (!bookingId) throw new Error(`Missing bookingId`);
        // tworzymy dokument booking w DB
        const bookingDoc = await index_1.databases.createDocument(process.env.APPWRITE_DATABASE_ID, process.env.APPWRITE_BOOKINGS_COLLECTION_ID, index_1.ID.unique(), {
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
        });
        const bookingId = bookingDoc.$id;
        // pobieramy token PayPal
        const accessToken = await (0, paypalAuth_1.getAccessToken)();
        if (!accessToken)
            throw new Error('No PayPal access token');
        // budujemy zamówienie
        const body = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: { currency_code: currency, value: totalPrice.toFixed(2) },
                    custom_id: bookingId,
                },
            ],
            application_context: {
                return_url: returnUrl ?? process.env.PAYPAL_RETURN_URL,
                cancel_url: cancelUrl ?? process.env.PAYPAL_CANCEL_URL,
            },
        };
        // wywołanie PayPal API
        const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        console.log('PayPal create order response:', data);
        return {
            statusCode: 200,
            body: JSON.stringify({
                paypalOrder: data,
                bookingId,
            }),
        };
    }
    catch (err) {
        console.error('Error in create-order:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
