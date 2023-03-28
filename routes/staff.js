const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const jsonParser = express.json()

const { encrypt, decrypt, userExists, addUser, getUser, addReservation, getReservations, checkPassword, authSession, generateQR, updateUser, uploadUserid, getUserid, deleteAccount,updateBookingStatus, getUnfinishedBookings, setCurrentUser, getCurrentUser, upload  
  } = require('../server-utils');

router.get("/", (req, res) => {
    res.send("you're logged in staff")
})

router
    .route('/dash')
    .get(authSession, (req, res) => {
        res.render('staff/staffDash')
    })
    .post(authSession, (req, res) => {
        
    })


router
    .route("/readQR")
    .get((req,res) => {
        res.render("staff/readQR")
    })
    .post(jsonParser, async (req, res) => {
        let username = await decrypt(req.body.text)
        await setCurrentUser(username)
        res.redirect(`userdata`)
    })

router
    .route('/userdata')
    .get(async(req,res) => {
        let username = req.params.username;
        let user = await getUser(username, "users");
        let bookings = await getUnfinishedBookings(username)
        res.render('staff/basicUserData', { user: user, bookings: bookings});
    })

module.exports = router