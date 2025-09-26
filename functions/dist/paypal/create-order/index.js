"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createOrder;
const paypalAuth_1 = require("../utils/paypalAuth");
async function createOrder(event, context) {
    const { amount, currency, bookingId } = JSON.parse(event.body);
    const accessToken = await (0, paypalAuth_1.getAccessToken)();
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
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
