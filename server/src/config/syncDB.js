import {models, mySequelize} from '../models/modelsIndex.js';

async function syncDatabase() {
    console.log('Syncing database...');
    try {
        await mySequelize.sync({ force: false, alter: false });
        return true;
    } catch (err) {
        console.error('Error syncing database:', err.message);
        return false;
        //throw err; // Propagate error to handle it in the main function
    }
}

export { syncDatabase } ;
