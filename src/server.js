const express = require('express');
const multer = require('multer');
const getAllSongs = require('./operations/getAllSongsOperation')();
// const upload = multer({dest: 'uploads/'});
const database = require('./database');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp/songs/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage })

const Blockchain = require('../dev/blockchain');
const songRecorder = new Blockchain();

const app = express();

app.get('/blockchain', (req, res) => {
    res.status(200).send(songRecorder);
});

app.post('/transaction', upload.single('song'), (req, res) => {
    const { file } = req;
    database.insert('songs', { name:  file.filename, src: file.destination + file.filename})
    const index = songRecorder.createNewTransaction(file);
    console.log(index)
    res.status(201).send('songRecorder');
});


app.get('/songs', (req, res) => {
    const songs = getAllSongs.execute();
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).send(songs);
});

app.get('/mine', (req, res) => {
    console.log('mine called')
    const { hash: lastBlockHash } = songRecorder.getLastBlock();

    const nonce = songRecorder.proofOfWork(songRecorder.pendingTransactions, lastBlockHash);

    const atualHashBLock = songRecorder.hashBlock(lastBlockHash, songRecorder.pendingTransactions, nonce);

    const blockCreated = songRecorder.createNewBlock(nonce, lastBlockHash, atualHashBLock)

    res.status(201).send(blockCreated);
})

app.listen(8000);