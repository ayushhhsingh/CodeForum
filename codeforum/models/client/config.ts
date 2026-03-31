import { Account, Avatars, Client, Databases, Storage } from "appwrite";

type AppwriteClientServices = {
    client: Client;
    databases: Databases;
    account: Account;
    avatars: Avatars;
    storage: Storage;
};

let servicesCache: AppwriteClientServices | null = null;

function createServices(): AppwriteClientServices {
    const endpoint =
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.trim() ||
        process.env.APPWRITE_ENDPOINT?.trim();
    const projectId =
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID?.trim() ||
        process.env.APPWRITE_PROJECT_ID?.trim();

    if (!endpoint) {
        throw new Error(
            "Missing environment variable: NEXT_PUBLIC_APPWRITE_ENDPOINT or APPWRITE_ENDPOINT. Add it to .env and restart the dev server."
        );
    }

    if (!projectId) {
        throw new Error(
            "Missing environment variable: NEXT_PUBLIC_APPWRITE_PROJECT_ID or APPWRITE_PROJECT_ID. Add it to .env and restart the dev server."
        );
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId);

    return {
        client,
        databases: new Databases(client),
        account: new Account(client),
        avatars: new Avatars(client),
        storage: new Storage(client),
    };
}

function getServices() {
    if (!servicesCache) {
        servicesCache = createServices();
    }

    return servicesCache;
}

function createLazyService<T extends object>(key: keyof AppwriteClientServices): T {
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
const account = createLazyService<Account>("account");
const avatars = createLazyService<Avatars>("avatars");
const storage = createLazyService<Storage>("storage");

export { client, databases, account, avatars, storage };
