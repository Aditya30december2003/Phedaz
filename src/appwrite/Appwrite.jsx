import { Client, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://appwrite.hivefinty.com/v1')
    .setProject('68472e8400352e6aa1e2');

    // Initialize the Databases service
const databases = new Databases(client);

// Initialize the Storage service
const storage = new Storage(client);

export { client, databases, storage };