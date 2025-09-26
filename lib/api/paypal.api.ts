import { client } from "@/lib/services/appwrite";
import { Functions } from "react-native-appwrite";

const functions = new Functions(client);

export async function createPaypalOrder(total: number, bookingId: string, currency: string = "USD") {
  const execution = await functions.createExecution(
    "68d66cb800384019b45c",
    JSON.stringify({ data: {amount: total, currency, bookingId} }),
    false
  );

  if (!execution.responseBody) throw new Error("Empty response from function");

  return JSON.parse(execution.responseBody);
}

export async function capturePaypalOrder(orderId: string) {
  const execution = await functions.createExecution(
    "68d6bb17c4fffffb04c3",
    JSON.stringify({ orderId }),
    false
  );

  if (!execution.responseBody) throw new Error("Empty response from function");

  return JSON.parse(execution.responseBody);
}


// import { client } from "@/lib/services/appwrite";
// import { Functions } from "react-native-appwrite";

// const functions = new Functions(client);

// export async function createPaypalOrder(total: number, bookingId: string, currency: string = "USD") {
//   const execution = await functions.createExecution(
//     "create-order", // ID Twojej Appwrite Function w konsoli
//     JSON.stringify({ amount: total, currency, bookingId }),
//     false
//   );

//   if (!execution.responseBody) throw new Error("Empty response from function");

//   return JSON.parse(execution.responseBody);
// }

// export async function capturePaypalOrder(orderId: string) {
//   const execution = await functions.createExecution(
//     "capture-order", // ID Twojej Appwrite Function w konsoli
//     JSON.stringify({ orderId }),
//     false
//   );

//   if (!execution.responseBody) throw new Error("Empty response from function");

//   return JSON.parse(execution.responseBody);
// }


// import { client } from "@/lib/services/appwrite";
// import { Functions } from "react-native-appwrite"; 

// const functions = new Functions(client);

// /**
//  * Tworzy zamówienie PayPal przez Appwrite Function
//  */
// export async function createPaypalOrder(total: number, currency: string = "USD") {
//   try {
//     const execution = await functions.createExecution(
//       "create-order", // <-- ID Twojej Appwrite Function w konsoli
//       JSON.stringify({ total, currency }),
//       false // async: false (chcemy odpowiedź od razu)
//     );

//     if (!execution.responseBody) throw new Error("Empty response from function");

//     const data = JSON.parse(execution.responseBody);
//     return data; // np. { id: "PAYPAL_ORDER_ID", links: [...] }
//   } catch (err) {
//     console.error("Error creating PayPal order:", err);
//     throw err;
//   }
// }

// /**
//  * Finalizuje (capture) zamówienie PayPal
//  */
// export async function capturePaypalOrder(orderId: string) {
//   try {
//     const execution = await functions.createExecution(
//       "capture-order", // <-- ID Twojej Appwrite Function w konsoli
//       JSON.stringify({ orderId }),
//       false
//     );

//     if (!execution.responseBody) throw new Error("Empty response from function");

//     const data = JSON.parse(execution.responseBody);
//     return data; // np. { status: "COMPLETED", purchase_units: [...] }
//   } catch (err) {
//     console.error("Error capturing PayPal order:", err);
//     throw err;
//   }
// }
