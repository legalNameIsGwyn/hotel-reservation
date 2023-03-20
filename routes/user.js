const express = require('express')
const router = express.Router()
const {
    getUser,
    addReservation,
    getReservations,
    authSession,
    generateQR,
    decrypt,
    
    } = require('../server-utils');

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
        let reservation = [req.session.username, req.body.checkin, req.body.checkout]

        addReservation(reservation)
        res.redirect('user/dash')
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
        let user = await getUser(username)
        let bookings = await getReservations(username)

        res.render('user/profile', {user : user, bookings : bookings})
    })

// ================= POINTS ==================

router
    .route('/points')
    .get(authSession, (req,res) => {
        res.render('user/points')
    })

router.get("/:username/user", authSession,(req, res) => {
    res.send("you're logged in user")
})
module.exports = router