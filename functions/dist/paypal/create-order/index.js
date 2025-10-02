"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createOrder;
const paypalAuth_1 = require("../utils/paypalAuth");
const index_1 = require("../../appwrite-client/index");
const node_appwrite_1 = require("node-appwrite");
async function createOrder(event, context) {
    try {
        const rawInput = event.req.body || '{}';
        const parsed = JSON.parse(rawInput);
        // auth user
        // wyciągam sam token string
        const jwtString = parsed.jwt.jwt; // zamiast JSON.parse(event.req.body.jwt)
        // buduje klienta z JWT
        const client = new node_appwrite_1.Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT)
            .setProject(process.env.APPWRITE_PROJECT_ID)
            .setJWT(jwtString);
        const account = new node_appwrite_1.Account(client);
        const authUser = await account.get();
        const { property, totalPrice, startDate, endDate, paymentMethod, fullName, email, phone, currency = 'USD', returnUrl, cancelUrl, } = parsed;
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
        // pobieram token PayPal
        const accessToken = await (0, paypalAuth_1.getAccessToken)();
        if (!accessToken)
            throw new Error('No PayPal access token');
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
