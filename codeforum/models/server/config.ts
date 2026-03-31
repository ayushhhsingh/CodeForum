import { Avatars, Client, Databases, Health, Storage, Users } from "node-appwrite";

type AppwriteServices = {
    client: Client;
    databases: Databases;
    users: Users;
    avatars: Avatars;
    health: Health;
    storage: Storage;
};

let servicesCache: AppwriteServices | null = null;

function createServices(): AppwriteServices {
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
        throw new Error(
            "Missing environment variable: APPWRITE_API_KEY. Add it to .env and restart the dev server."
        );
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

    return {
        client,
        databases: new Databases(client),
        users: new Users(client),
        avatars: new Avatars(client),
        health: new Health(client),
        storage: new Storage(client),
    };
}

function getServices() {
    if (!servicesCache) {
        servicesCache = createServices();
    }

    return servicesCache;
}

function createLazyService<T extends object>(key: keyof AppwriteServices): T {
    return new Proxy({} as T, {
        get(_target, property, receiver) {
            const service = getServices()[key] as T;
            const value = Reflect.get(service, property, receiver);

            return typeof value === "function" ? value.bind(service) : value;
        },
    });
}

const client = createLazyService<Client>("client");
const databases = createLazyService<Databases>("databases");
const users = createLazyService<Users>("users");
const avatars = createLazyService<Avatars>("avatars");
const health = createLazyService<Health>("health");
const storage = createLazyService<Storage>("storage");

export { client, databases, users, avatars, health, storage };
