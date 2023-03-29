const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const jsonParser = express.json()

const { encrypt, decrypt, userExists, addUser, getUser, addReservation, getReservations, checkPassword, authSession, generateQR, updateUser, uploadUserid, getUserid, deleteAccount, updateBookingStatus, updateRoom, getUnfinishedBookings, setCurrentUser, currentUser, getLatestBookingID, updateCheckout, addGuestReservation, getGuestReservations, getAllUnfinishedBookings, upload } = require('../server-utils');

router.get("/", (req, res) => {
    res.send("you're logged in staff")
})

router
    .route('/dash')
    .get(authSession, (req, res) => {
        res.render('staff/staffDash')
    })
    .post(authSession, (req, res) => {
        res.send("why are you here?")
    })


router
    .route("/readQR")
    .get(authSession,async (req,res) => {
        let booking = await getGuestReservations()
        res.render("staff/readQR", {bookings : booking})
    })
    .post(jsonParser, async (req, res) => {
        let username = await decrypt(req.body.text)
        await setCurrentUser(username)
        res.redirect(`userdata`)
    })

router
    .route("/checkout")
    .get(authSession, (req, res) => {
        res.render("staff/checkout")
    })
    .post(jsonParser, async(req, res) => {
        try {
            let username = await decrypt(req.body.text)
            let currBookingID = await getLatestBookingID(username, "confirmed")
    
            if(!currBookingID){
                console.log('no checked-in found')
                res.status(404).json({ message: "No latest checked-in for this user." });
            } else {
                await updateBookingStatus(username, currBookingID, "checked-in")
                res.json({ message: "Check-in successful." });
            }
        } catch (error) {
            console.error("\nERROR in checkout POST",error);
            res.status(500).json({ message: "An error occurred while processing your request." });
        }
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

router
    .route("/reservations")
    .get(authSession, async (req, res) => {
        let bookings = await getAllUnfinishedBookings()

        res.render('staff/reservations', {bookings: bookings})
    })
module.exports = router