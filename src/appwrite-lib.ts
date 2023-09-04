import { Account, Client, Databases, ID} from 'appwrite';

const client = new Client();
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);


    export const appwrite = {
        client,
        account: new Account(client),
        Databases: new Databases(client),
        ID
    };