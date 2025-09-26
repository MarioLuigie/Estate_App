"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = captureOrder;
const paypalAuth_1 = require("../utils/paypalAuth");
async function captureOrder(event, context) {
    const { orderId } = JSON.parse(event.body);
    const accessToken = await (0, paypalAuth_1.getAccessToken)();
    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    // Tutaj można też zapisać do bazy Appwrite status płatności
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
}
