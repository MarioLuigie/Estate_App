// services/fetchLogger.ts
const originalFetch = global.fetch;

let readCount = 0;
let writeCount = 0;

global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === "string" && input.includes("appwrite")) {
    const method = init?.method?.toUpperCase() ?? "GET";

    // klasyfikacja read/write
    if (method === "GET") {
      readCount++;
    } else {
      writeCount++;
    }

    console.log(
      `[Appwrite Request] ${method} ${input} | Reads: ${readCount}, Writes: ${writeCount}`
    );
  }

  const res = await originalFetch(input, init);
  return res;
};
