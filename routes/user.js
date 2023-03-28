const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const path = require('path')

const { encrypt, decrypt, userExists, addUser, getUser, addReservation, getReservations, checkPassword, authSession, generateQR, updateUser, uploadUserid, getUserid, setHasID, upload 
  } = require('../server-utils');
const { render } = require('ejs')

router
    .route('/dash')
    .get(authSession, (req, res) => {
        res.render('user/userDash')
    })
    .post(authSession, (req, res) => {
        res.send("why are you here?")
    })

router
    .route('/hotels')
    .get(authSession,(req, res) => {
        res.render('user/hotels')
    })
    .post(authSession,async (req, res) => {
        let username = req.session.username
        let decryptedUsername = await decrypt(username)
        let reservation = [decryptedUsername, req.body.checkin, req.body.checkout, req.body.adults, req.body.children]

        addReservation(reservation)
        res.redirect('dash')
    })

router
    .route('/reservations')
    .get(authSession, async (req,res) => {
        let bookings = await getReservations(await getUser(req.session.username).username)
        res.render("user/reservations", {bookings: bookings})

    })
    .post(authSession, async (req, res) => {
        console.log("in reservations_history")

    })

router
    .route('/userQR')
    .get(authSession, async (req,res) => {
        const qrImage = await generateQR(req.session.username);
        res.render('user/userQR', {qrImage});
    })

router
    .route('/profile')
    .get(authSession,async (req,res) => {
        let username = await decrypt(req.session.username)
        let user = await getUser(username, "users")

        if (user.hasID == 1){
            let idName = await getUserid(username)
            console.log(idName)
            let frontid = idName[1]
            let backid = idName[2]

            let frontFilepath = `/uploads/${frontid}`;
            let backFilepath = `/uploads/${backid}`;

            res.render('user/profile', {user: user, frontFilepath: frontFilepath, backFilepath :backFilepath})
        }
        res.render('user/profile', {user : user})
    })

router
    .route('/points')
    .get(authSession, (req,res) => {
        res.render('user/points')
    })
    
router
    .route('/edit')
    .get(authSession, async (req, res) => {
        let sessionUser = await decrypt(req.session.username)
        let table = req.session.table
        let user = await getUser(sessionUser, table)
        res.render('user/edit',{ user: user})
    })
    .post(authSession, async (req, res) => {
        const userData = req.body;
        let username = await decrypt(req.session.username)

        if(userData.password != userData.password2){
            res.render('user/edit', {message: "Passwords don't match."})
        }
        let password = await bcrypt.hash(userData.password, saltRounds )

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

router
    .route('/editID')
    .get(authSession,  (req,res) => {
        res.render('user/editID')
    })
    .post(authSession, upload.fields([
        { name: 'frontID' }, 
        { name: 'backID' }]), 
        async (req,res) => {

        let username = await decrypt(req.session.username)
        let user = await getUser(username, req.session.table)
        let idType = req.body.idType
        let hasID = user.hasID
        const frontid = req.files['frontID'][0].filename;
        const backid = req.files['backID'][0].filename;

        let frontFilepath = `/uploads/${frontid}`;
        let backFilepath = `/uploads/${backid}`;

        let userid = [username, frontid, backid, idType]

        uploadUserid(userid, hasID) 
        user.hasID = 1
        
        res.render('user/profile', {
            user: user, 
            frontFilepath: frontFilepath, 
            backFilepath: backFilepath})
    })

module.exports = router