const fs = require('node:fs/promises');
let instance;

class Database {
    #database = {}

    constructor() {
        if (instance) {
            throw new Error("New instance cannot be created!!");
        }

        instance = this;

        fs.readFile('./db.json', 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist();
            })
    }

    #persist() {
        fs.writeFile('./db.json', JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? [];
        if (!search) {
            return data = this.#database[table] ?? [];
        }

        return this.#database[table].filter(user => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.includes(search));
    }

    insert(table, data) {
        console.log('insert called')
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }
        this.#persist();

        return data;
    }

    delete(table, id) {
        const userIndex = this.#database[table].findIndex(db => db.id === id);

        if (userIndex > -1) {
            return 'User not found.';
        }

        this.#database[table].splice(userIndex, 1);

        this.#persist();

        return this.#database[table];

    }

    update(table, id, data) {
        const userIndex = this.#database[table].findIndex(db => db.id === id);

        if (userIndex <= -1) {
            return 'User not found.';
        }
        const newUser = {
            id,
            ...data
        }
        this.#database[table].splice(userIndex, 1, newUser);

        this.#persist();

        return this.#database[table][userIndex];

    }
}

let databaseInstance = Object.freeze(new Database());

module.exports = databaseInstance;