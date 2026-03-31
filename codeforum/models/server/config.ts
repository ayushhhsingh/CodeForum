import { Avatars, Client ,Users, Databases, Health, Storage } from "node-appwrite";


const client = new Client();
const apiKey = process.env.APPWRITE_API_KEY?.trim();
const endpoint =
    process.env.APPWRITE_ENDPOINT?.trim() ||
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.trim();
const projectId =
    process.env.APPWRITE_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID?.trim();

if (!endpoint) {
    throw new Error(
        "Missing environment variable: APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_ENDPOINT. Add it to .env and restart the dev server."
    );
}

if (!projectId) {
    throw new Error(
        "Missing environment variable: APPWRITE_PROJECT_ID or NEXT_PUBLIC_APPWRITE_PROJECT_ID. Add it to .env and restart the dev server."
    );
}

if (!apiKey) {
    throw new Error("Missing environment variable: APPWRITE_API_KEY. Add it to .env and restart the dev server.");
}

client
    .setEndpoint(endpoint) // Your API Endpoint
    .setProject(projectId) // Your project ID
    .setKey(apiKey) // Your secret API key

;

const databases = new Databases(client)
const users = new Users(client);
const avatars = new Avatars(client);
const health = new Health(client);
const storage = new Storage(client);

export {client , databases , users,avatars,health,storage}
