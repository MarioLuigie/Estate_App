"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID = exports.account = exports.databases = exports.client = void 0;
const node_appwrite_1 = require("node-appwrite");
Object.defineProperty(exports, "ID", { enumerable: true, get: function () { return node_appwrite_1.ID; } });
const client = new node_appwrite_1.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
exports.client = client;
const databases = new node_appwrite_1.Databases(client);
exports.databases = databases;
const account = new node_appwrite_1.Account(client);
exports.account = account;
