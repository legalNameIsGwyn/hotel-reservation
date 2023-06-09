const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const path = require('path')

const { decrypt, 
    userExists, 
    getUser, 
    addReservation, 
    getReservations, 
    checkPassword, 
    authSession, 
    generateQR, 
    updateUser, 
    uploadUserid, 
    getUserid, 
    deleteAccount, 
    upload, 
    getUserPayment 
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
    .route('/delete')
    .get(authSession, (req, res) => {
        res.render('user/delete')
    })
    .post(authSession, async (req, res) => {
        let username = await decrypt(req.session.username)
        let passCheck = await checkPassword(req.body.password, username, req.session.table)

        if(passCheck){
            await deleteAccount(username)
            res.render('login')
        } else if (!passCheck) {
            res.render('user/delete', {message : "Invalid password."})
        }
    })

router
    .route('/hotels')
    .get(authSession,(req, res) => {
        res.render('user/hotels')
    })
    .post(authSession,async (req, res) => {
        try{
            let username = await decrypt(req.session.username)
            let reservation = [username, req.body.checkin, req.body.checkout, "confirmed", 0, req.body.adults, req.body.children]
    
            addReservation(reservation)
            res.redirect('dash')
        } catch(e){
            console.error("\nERROR in hotels POST\n",e)
        }
    })

router
    .route('/')
    .get(authSession, (req, res) => {
        res.render('user/userDash')
    })

router
    .route('/reservations')
    .get(authSession, async (req,res) => {
        let username = await decrypt(req.session.username)
        let bookings = await getReservations(username)
        res.render("user/reservations", { bookings: bookings})

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
    .get(authSession, async (req,res) => {
        var username = await decrypt(req.session.username)
        let user = await getUser(username, "users")
        let userHasPay = await userExists(username, "userpayment")
        
        if (user.hasID == 1 ){
            let idName = await getUserid(username)
            let frontid = idName[0].frontid
            let backid = idName[0].backid

            let frontFilePath = `/uploads/${frontid}`;
            let backFilePath = `/uploads/${backid}`;

            if(userHasPay){
                let userpay = await getUserPayment(username)
                
                res.render('user/profile', {user: user, frontFilePath : frontFilePath, backFilePath : backFilePath, userpay: userpay})
            } else {
                res.render('user/profile', {user : user, userHasPay, frontFilePath : frontFilePath, backFilePath : backFilePath})
            }
        } else {
            res.render('user/profile', {user : user, userHasPay})
        }
        
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

        await uploadUserid(userid, hasID) 
        
        res.render('user/profile', {
            user: user, 
            frontFilepath: frontFilepath, 
            backFilepath: backFilepath})
    })

module.exports = router