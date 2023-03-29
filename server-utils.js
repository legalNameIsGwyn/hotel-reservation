const crypto = require('crypto');
const fs = require('fs')
const { secretKey } = require('./config');
const qr = require('qrcode')
const {connection} = require('./sql-connection')
const bcrypt = require('bcrypt')
const path = require('path')
const multer = require('multer');
const e = require('express');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: async function (req, file, cb) {
        let username = await decrypt(req.session.username)
        let extension = path.extname(file.originalname)
        let filename = username

        if (file.fieldname === 'frontID') {
            filename += '-front-'
        } else if (file.fieldname === 'backID') {
            filename += '-back-' 
        }
        
        filename +=  Date.now() + extension
        console.log(filename)
        console.log("done uploading")
        cb(null, filename)
    }
});

const upload = multer({ storage: storage });

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
        } else if (table == "userpayment"){
            const [rows] = await connection.promise().execute('SELECT * FROM admins WHERE username = ?', [username]
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
    console.log(user)
    try {
        // Insert new user into students
        await connection.promise().query(
            'INSERT INTO users (username, password, first_name, last_name, sex, age, contact_number, birthday, email, address, active, hasID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', user
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
                'SELECT username, password, first_name, last_name, sex, age, contact_number, DATE_FORMAT(birthday, "%W, %Y-%m-%d") as birthday, email, address, active, hasID FROM users WHERE username = ?', [username]
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

async function addReservation(reservation) {
    try{
        await connection.execute(
            'INSERT INTO reservations (username, checkin, checkout, bookingstatus, room, adults, children) VALUES (?, ?, ?, ?, ?, ?, ?)', reservation
        )
        console.log('Reservation added.')
    } catch (error){
        console.log('\nERROR IN addReservation\n')
    }
}

async function getReservations(username) {
    try{
        let [rows, fields] = await connection.promise().query(
            'SELECT id, username, DATE_FORMAT(checkin, "%W, %Y-%m-%d") as checkin, DATE_FORMAT(checkout, "%W, %Y-%m-%d") as checkout, bookingstatus, room, adults, children FROM reservations WHERE username = ? ORDER BY id DESC', [username]
        )

        return rows;
    } catch (error){
        console.log('\nERROR IN getReservations\n')
    }
}

async function addGuestReservation(reservation) {
    try{
        await connection.execute(
            'INSERT INTO guestreservations (username, checkin, checkout, bookingstatus, room, adults, children) VALUES (?, ?, ?, ?, ?, ?, ?)', reservation
        )
        console.log('Reservation added.')
    } catch (error){
        console.log('\nERROR IN addReservation\n')
    }
}

async function getGuestReservations(username) {
    try{
        let [rows, fields] = await connection.promise().query('SELECT id, username, DATE_FORMAT(checkin, "%W, %Y-%m-%d") as checkin, DATE_FORMAT(checkout, "%W, %Y-%m-%d") as checkout, bookingstatus, room, adults, children FROM guestreservations ORDER BY id DESC')

        return rows;
    } catch (error){
        console.log('\nERROR IN getReservations\n')
    }
}

async function checkPassword(password, username, table){
    let user = await getUser(username, table)
    return await bcrypt.compare(password, user.password)
}

async function deleteAccount(username) {
    try{
        await connection.promise().query("UPDATE users SET active = 0 WHERE username = ?", username)
    } catch(e) {
        console.error(e)
    }
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

async function uploadUserid(userid, hasID) {
    try {
        if(hasID == 0){
            console.log("No id")
            await connection.promise().query('INSERT INTO userid (username, frontid, backid, idtype) VALUES (?,?,?,?)', userid)

            console.log("updating userid")
            await connection.promise().query('UPDATE users SET hasID = 1 WHERE username = ?', userid[0])
            console.log(userid[0])
        } else if (hasID == 1) {
            userid.push(userid.shift())
            await connection.execute('UPDATE userid SET frontid = ?, backid = ?, idtype = ? WHERE username = ?', userid[0])
        }

    } catch (error) {
      console.log(`\nError in uploadImages\n `, error);
    }
}
  
async function getUserid(username) {
    try {
        let [rows, fields] = await connection.promise().query('SELECT * FROM userid WHERE username = ?', [username])
        
        return rows
        } catch (error) {
          console.log(`\nError in getUserImages for user ${username}:\n `, error);
          return null;
        }
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

async function updateBookingStatus(username, bookingID, status) {
    await connection.promise().query("UPDATE reservations SET bookingstatus = ? WHERE username = ? AND id = ?", [status, username, bookingID])
}

async function updateRoom(username, bookingID, room){
    await connection.promise().query("UPDATE reservations SET room = ? WHERE username = ? AND id = ?", [room, username, bookingID])
}

async function updateCheckout(username, bookingID, room){
    await connection.promise().query("UPDATE reservations SET checkout = ? WHERE username = ? AND id = ?", [room, username, bookingID])
}

async function getLatestBookingID(username, bookingStatus){
    console.log(username)
    try {
        let [rows, field] = await connection.promise().query("SELECT id FROM reservations WHERE bookingstatus = ? AND username = ? ORDER BY id DESC LIMIT 1", [bookingStatus, username])
        console.log(rows)
        return rows[0]
    } catch (e) {
        console.log("\nERROR in getCurrentBooking\n", e)
    }
}

async function getUnfinishedBookings(username){
    try{
        let [rows, fields] = await connection.promise().query('SELECT id, DATE_FORMAT(checkin, "%W, %Y-%m-%d") as checkin, DATE_FORMAT(checkout, "%W, %Y-%m-%d") as checkout, bookingstatus, room, adults, children FROM reservations WHERE username = ? AND checkin >= CURDATE() ORDER BY id DESC', [username])
        return rows;
    } catch(e){
        console.log("error in getUnfinishedBookings")
    }
}

async function getAllUnfinishedBookings(){
    try{
        let [rows, fields] = await connection.promise().query('SELECT id, username, DATE_FORMAT(checkin, "%W, %Y-%m-%d") as checkin, DATE_FORMAT(checkout, "%W, %Y-%m-%d") as checkout, bookingstatus, room, adults, children FROM reservations WHERE checkin >= CURDATE() ORDER BY id DESC')

        return rows;
    } catch(e){
        console.log("error in getUnfinishedBookings")
    }
}

async function currentUser(){
    const [rows] = await connection.promise().query('SELECT * FROM currentuser LIMIT 1');
    if (rows.length === 0) {
      return null; 
    }
    return rows[0].username;
}

async function setCurrentUser(username){
    let user = await currentUser()
    try{
        let query
        if(user){
            query = "UPDATE currentuser SET username = ?"
        } else if (!user){
            query = "INSERT INTO currentuser (username) VALUES (?)"
        }

        await connection.promise().query(query, username)
    } catch(e) {
        console.log("Error in setCurrentUser", e)
    }
}

async function addUserPayment(username, method, number){
    try{
        await connection.promise().query(
            "INSERT INTO userpayment (username, method, number) VALUES (?,?,?)", [username, method, number]
        )
    } catch(e) {
        console.log("\nERROR in addUserPayment")
    }
}

async function getUserPayment(username){
    try{
        const [rows] = await connection.promise().query('SELECT * FROM userpayment WHERE username = ?', [username]);

        return rows
    }catch(e) {
        console.log("\nERROR in getUserPayment")
    }
}


module.exports = { encrypt, decrypt, userExists, addUser, getUser, addReservation, getReservations, checkPassword, authSession, generateQR, updateUser, uploadUserid, getUserid, deleteAccount, updateBookingStatus, updateRoom, getUnfinishedBookings, setCurrentUser, currentUser, getLatestBookingID, updateCheckout, addGuestReservation, getGuestReservations, getAllUnfinishedBookings, addUserPayment, getUserPayment, upload };