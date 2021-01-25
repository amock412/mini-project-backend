const { MongoClient, ObjectID } = require('mongodb');

// builds out library object 
function libraryRepo() {
    const url = 'mongodb+srv://am4:MM412Proj@cluster0.olht9.mongodb.net/cscl?retryWrites=true&w=majority'; // localhost url 
    const dbName = 'cscl'; 

    function get(query, limit) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect(); // open up connection 
                const db = client.db(dbName);
                // .find will return a cursor
                let items = db.collection('books').find(query); // newspapers is where data was loaded 
                if (limit > 0) {
                    items = items.limit(limit); // find only a certain number of things
                }
                resolve(await items.toArray());
                client.close(); // close connection
            } catch (error) {
                reject(error) // regular try catch block w/ reject error
            }
        })
    }
    
    function getById(id) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect(); // open up connection 
                const db = client.db(dbName);
                // _id is specific type, objectID converts the id to a string 
                let item = await db.collection('books').findOne({_id: ObjectID(id)}); // returns first item
                resolve(item);
                client.close(); // close connection
            } catch (error) {
                reject(error) // regular try catch block w/ reject error
            }
        })
    }

    function add(item) {
        return new Promise(async (resolve, reject) => {
          const client = new MongoClient(url);
          try {
            await client.connect();
            const db = client.db(dbName);
            const addedItem = await db.collection('books').insertOne(item);
    
            resolve(addedItem.ops[0]);
            client.close();
          } catch (error) {
            reject(error);
          }
        });
    }

    function update(isbnVal, newItem) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect(); // open up connection 
                const db = client.db(dbName);
                // findOneAndReplace takes query and replacement, returnOriginal makes sure that don't return query but changed item
                const updatedItem = await db.collection('news')
                    .findOneAndReplace({isbn: isbnVal}, newItem, {returnOriginal: false}); 
                
                resolve(updatedItem.value); // return the updated item
                client.close(); // close connection
            } catch (error) {
                reject(error) // regular try catch block w/ reject error
            }
        })
    }

    function remove(isbnVal) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect(); // open up connection 
                const db = client.db(dbName);
                const removed = await db.collection('books')
                    .deleteOne({isbn: isbnVal}); 
                
                resolve(removed.deletedCount == 1); //check if one thing was deleted
                client.close(); // close connection
            } catch (error) {
                reject(error) // regular try catch block w/ reject error
            }
        })
    }

    return {get, getById, add, update, remove,}
}

// return repo object and execute it right here
module.exports = libraryRepo();