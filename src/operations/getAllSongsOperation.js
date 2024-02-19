const database = require('../database');

module.exports = () => ({
    execute: () => {
        const songs = database.select('songs');
        return songs;
    }
}); 