const crypto = require('crypto');

const secretKey = crypto.randomBytes(16).toString('hex');

module.exports ={
    secretKey: secretKey
}