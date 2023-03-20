const express = require('express')
const router = express.Router()
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
  } = require('../server-utils');

router
    .route('/dash')
    .get(authSession, (req, res) => {
        res.render('user/userDash',{ username:req.params.username})
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
    .route(authSession,'/reservations')
    .get(async (req,res) => {
        let reservations = await getReservations(req.session.username)
        res.send(reservations)

    })
    .post(authSession,async (req, res) => {
        console.log("in reservations_history")

    })
     

router.get("/", (req, res) => {
    res.send("you're logged in user")
})
module.exports = router