import { Client, Databases, Account, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)  
  .setProject(process.env.APPWRITE_PROJECT_ID!) 
  .setKey(process.env.APPWRITE_API_KEY!);      

const databases = new Databases(client);
const account = new Account(client);

export { client, databases, account, ID };
