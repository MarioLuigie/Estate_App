"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = getAccessToken;
async function getAccessToken() {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_APP_SECRET}`).toString("base64");
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch PayPal access token");
    }
    const data = await response.json();
    return data.access_token;
}
