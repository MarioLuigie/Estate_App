// services/loggedDatabases.ts
import { databases } from "./appwrite";

function logRequest(method: string, ...args: any[]) {
  console.log(`[Appwrite] ${method}`, JSON.stringify(args, null, 2));
}

export const loggedDatabases = {
  listDocuments: async (...args: Parameters<typeof databases.listDocuments>) => {
    logRequest("listDocuments", ...args);
    const res = await databases.listDocuments(...args);
    console.log(`[Appwrite] listDocuments response:`, res.documents.length);
    return res;
  },
  getDocument: async (...args: Parameters<typeof databases.getDocument>) => {
    logRequest("getDocument", ...args);
    return databases.getDocument(...args);
  },
  createDocument: async (...args: Parameters<typeof databases.createDocument>) => {
    logRequest("createDocument", ...args);
    return databases.createDocument(...args);
  },
  updateDocument: async (...args: Parameters<typeof databases.updateDocument>) => {
    logRequest("updateDocument", ...args);
    return databases.updateDocument(...args);
  },
  deleteDocument: async (...args: Parameters<typeof databases.deleteDocument>) => {
    logRequest("deleteDocument", ...args);
    return databases.deleteDocument(...args);
  },
};
