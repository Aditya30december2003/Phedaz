import { Client, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://centralapps.hivefinty.com/v1')
    .setProject('67912e8e000459a70dab');

    // Initialize the Databases service
const databases = new Databases(client);

// Initialize the Storage service
const storage = new Storage(client);

export { client, databases, storage };