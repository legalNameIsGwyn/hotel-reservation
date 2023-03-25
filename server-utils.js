const crypto = require('crypto');
const fs = require('fs')
const { secretKey } = require('./config');
const qr = require('qrcode')
const {connection} = require('./sql-connection')
const bcrypt = require('bcrypt')


function encrypt(text) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

async function userExists(username, table) {
    try {
        if(table == "users"){
            const [rows] = await connection.promise().execute(
                'SELECT * FROM users WHERE username = ?', [username]
            )
            return rows.length > 0
        } else if (table == "admins"){
            const [rows] = await connection.promise().execute(
                'SELECT * FROM admins WHERE username = ?', [username]
            )
            return rows.length > 0
        }

    } catch (error) {
        console.error(error);
        console.log('\nThere was an error in userExists\n')
        // Return false if there is an error
        return false;
    }
}

async function addUser(user) {
    try {
        // Insert new user into students
        await connection.execute(
            'INSERT INTO users (username, password, first_name, last_name, sex, age, contact_number, birthday, email, address, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            user
        );
        
        } catch (error) {
            console.error(error);
            console.log('Error in addUser')
    }
}

async function getUser(username, table){
    
    try {
        if(table == "users"){
            let [rows, fields] = await connection.promise().query(
                'SELECT * FROM users WHERE username = ?', [username]
            );
            return rows[0];
        } else if (table == "admins") {
            let [rows, fields] = await connection.promise().query(
                'SELECT * FROM admins WHERE username = ?', [username]
            );
            return rows[0];
        }
        } catch (error) {
            console.error(error);
            console.log('Error in getUser');
    }
}

// RESERVATION
async function addReservation(reservation) {
    try{
        await connection.execute(
            'INSERT INTO reservations (username, checkin, checkout, adults, children) VALUES (?, ?, ?, ?, ?)', reservation
        )
        console.log('Reservation added.')
    } catch (error){
        console.log('\nERROR IN addReservation\n')
    }
}

// returns ALL reservations
async function getReservations(username) {
    try{
        let [rows, fields] = await connection.promise().query(
            'SELECT * FROM reservations WHERE username = ? ORDER BY id DESC', [username]
        )
        return rows;
    } catch (error){
        console.log('\nERROR IN getReservations\n')
    }
}
async function checkPassword(password, username, table){
    let user = await getUser(username, table)
    return await bcrypt.compare(password, user.password)
}

function authSession(req, res, next){
    if (req.session && req.session.username) {
        next();
    } else {
        res.redirect('/login');
    }
}
const generateQR = async text => {
    try {
      return await qr.toDataURL(text, {
        version: 13,
        color:{
        dark: '#000000',
        light: '#0000'
      } });
    } catch (err) {
      console.error(err);
    }
}

function uploadImage(username) {
    const imageBuffer = fs.readFileSync()
}

async function updateUser(userData){

    try{

        const query = 'UPDATE users SET password = ?,first_name = ?,last_name = ?,sex = ?,age = ?,contact_number = ?,birthday = ?,email = ?,address = ? WHERE username = ?';
          
        await connection.promise().query(query, userData);


    } catch(e) {
        console.log('Error in updateUser\n')
        console.log(e)
    }
}

module.exports = {encrypt, decrypt, userExists, addUser, getUser, addReservation, getReservations,  checkPassword,authSession, generateQR, updateUser };