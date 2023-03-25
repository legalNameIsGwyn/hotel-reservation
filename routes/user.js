const express = require('express')
const router = express.Router()
const multer = require('multer')
const {
    encrypt,
    decrypt,
    userExists,
    addUser,
    getUser,
    addReservation,
    getReservations,
    authSession,
    generateQR,
    updateUser
  } = require('../server-utils');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
router
    .route('/dash')
    .get(authSession, (req, res) => {
        res.render('user/userDash')
    })
    .post(authSession, (req, res) => {
        
    })

// ================ HOTELS =================

router
    .route('/hotels')
    .get(authSession,(req, res) => {
        res.render('user/hotels')
    })
    .post(authSession,async (req, res) => {
        let username = req.session.username
        let decryptedUsername = await decrypt(username)
        console.log(decryptedUsername)
        let reservation = [decryptedUsername, req.body.checkin, req.body.checkout, req.body.adults, req.body.children]

        addReservation(reservation)
        res.redirect('dash')
    })

// ================ RESERVATION =================
router
    .route('/reservations')
    .get(authSession, async (req,res) => {
        let reservations = await getReservations(req.session.username)
        res.send(reservations)

    })
    .post(authSession, async (req, res) => {
        console.log("in reservations_history")

    })
// ================ QR CODE =================
router
    .route('/userQR')
    .get(authSession, async (req,res) => {
        const qrImage = await generateQR(req.session.username);
        res.render('user/userQR', {qrImage});
    })

// ================= PORFILE ==================

router
    .route('/profile')
    .get(authSession,async (req,res) => {
        let username = await decrypt(req.session.username)
        let user = await getUser(username, "users")
        let bookings = await getReservations(username)
        res.render('user/profile', {user : user, bookings : bookings})
    })

// ================= POINTS ==================

router
    .route('/points')
    .get(authSession, (req,res) => {
        res.render('user/points')
    })
    
// ================= EDIT ==================
router
    .route('/edit')
    .get(authSession, async (req, res) => {
        let sessionUser = await decrypt(req.session.username)
        let table = req.session.table
        let user = await getUser(sessionUser, table)
        console.log(user)
        res.render('user/edit',{ user: user})
    })
    .post(authSession, async (req, res) => {
        const userData = req.body;
        let username = await decrypt(req.session.username)

        if(userData.password != userData.password2){
            res.render('user/edit', {message: "Passwords don't match."})
        }
        let password = encrypt(userData.password)

        let data = [
            password, 
            userData.first_name, 
            userData.last_name, 
            userData.sex, 
            userData.age, 
            userData.contact_number, 
            userData.birthday, 
            userData.email, 
            userData.address,
            username];

        updateUser(data)
        let user = await getUser(username, "users")
        let bookings = await getReservations(username)
        res.render('user/profile', {user: user, bookings: bookings})
    })

module.exports = router