const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const jsonParser = express.json()

const { encrypt, decrypt, userExists, addUser, getUser, addReservation, getReservations, checkPassword, authSession, generateQR, updateUser, uploadUserid, getUserid, deleteAccount, updateBookingStatus, updateRoom, getUnfinishedBookings, setCurrentUser, currentUser, getCurrentBookingID, updateCheckout, addGuestReservation, getGuestReservations, upload } = require('../server-utils');

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
    .get(authSession,async (req,res) => {
        let booking = await getGuestReservations()
        res.render("staff/readQR", {bookings : booking})
    })
    .post(jsonParser, async (req, res) => {
        let username = await decrypt(req.body.text)
        console.log(`The user is: ${username}`)
        await setCurrentUser(username)
        res.redirect(`userdata`)
    })

router
    .route("/checkout")
    .get(authSession, (req, res) => {
        res.render("staff/checkout")
    })
    .post(jsonParser, async(req, res) => {
        let username = await decrypt(req.body.text)
        let currBookingID = await getCurrentBookingID(username)

        await updateBookingStatus(username, currBookingID, "checked-out")
        res.redirect("dash")
    })

router
    .route('/userdata')
    .get(authSession, async(req,res) => {
        let username = await currentUser();
        let user = await getUser(username, "users");
        let bookings = await getUnfinishedBookings(username)
        res.render('staff/basicUserData', { user: user, bookings: bookings});
    })
    .post(authSession,async (req, res) => {
        let username = await currentUser()
        let status = req.body.status
        let reservation = [username, req.body.checkin, req.body.checkout, status, req.body.room, req.body.adults, req.body.children]

        await addReservation(reservation)
        res.redirect('dash')
    })

router
    .route('/checkout-update')
    .get(authSession, async(req, res) => {
        res.render('staff/updateCheckout')
    })
    .post(authSession, async(req, res) => {
        let username = req.body.username
        let newCheckout = req.body.newCheckout
        let bookingID = req.body.bookingID

        if(!await userExists(username, "users")){
            res.render('updateCheckout', {message: "User does not exist"})
        }
        await updateCheckout(username, bookingID, newCheckout)
        res.render('staff/dash')
    } )

router
    .route("/guest")
    .get(authSession, async(req, res) => {
        let bookings = await getGuestReservations()
        res.render("staff/guest", {bookings : bookings})
    })
    .post(authSession, async (req, res) => {
        let reservation = [req.body.guestName, req.body.checkin, req.body.checkout, req.body.status, req.body.room, req.body.adults, req.body.children]

        await addGuestReservation(reservation)
        res.render('staff/dash')
    })
module.exports = router