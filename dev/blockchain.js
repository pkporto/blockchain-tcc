const sha256 = require('sha256')
class Blockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];

        this.createNewBlock(0, 'any_hash', 'some_hash');
    };

    createNewBlock(nonce, previousBlockHash, hash) {
        console.log('called')
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: [...this.pendingTransactions],
            nonce,
            hash,
            previousBlockHash
        }
        this.chain.push(newBlock);
        return newBlock;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    createNewTransaction(transaction) {
        this.pendingTransactions.push(transaction);

        return this.getLastBlock()['index'] + 1;
    }

    hashBlock(previousBlockHash, currentBlockData, nonce) {
        const dataString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataString);
        return hash;
    }

    proofOfWork(currentBlockData, previousBlockHash) {
        let nonce = 0;
        let teste;
        do {
            const hash = this.hashBlock(previousBlockHash, currentBlockData, nonce++);
            console.log(hash)
            teste = hash.slice(0, 1);
        } while (teste != 0)
        return nonce;
    }
}

module.exports = Blockchain;