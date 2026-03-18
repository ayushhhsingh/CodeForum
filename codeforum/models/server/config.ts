import env from "../../app/env";

import { Avatars, Client ,Users, Databases, Health, Storage } from "node-appwrite";


const client = new Client();
const apiKey = process.env.APPWRITE_API_KEY?.trim();

if (!apiKey) {
    throw new Error("Missing environment variable: APPWRITE_API_KEY. Add it to .env and restart the dev server.");
}

client
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(apiKey) // Your secret API key

;

const databases = new Databases(client)
const users = new Users(client);
const avatars = new Avatars(client);
const health = new Health(client);
const storage = new Storage(client);

export {client , databases , users,avatars,health,storage}
