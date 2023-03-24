const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const mysql2 = require('mysql2');

const options = {    
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'easytel',
    connectionLimit: 10,
}

const sessionStore = new MySQLStore(options)
const connection = mysql2.createPool(options)

module.exports = {
    connection: connection,
    sessionStore: sessionStore
}