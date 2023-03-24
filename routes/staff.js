const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const jsonParser = express.json()

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

router.get("/", (req, res) => {
    res.send("you're logged in staff")
})
// ================ DASHBOARD =====================
router
    .route('/dash')
    .get(authSession, (req, res) => {
        res.render('staff/staffDash')
    })
    .post(authSession, (req, res) => {
        
    })

// ================= READ QR ======================
router
    .route("/readQR")
    .get((req,res) => {
        res.render("staff/readQR")
    })
    .post(jsonParser, async (req, res) => {
        let username = await decrypt(req.body.text)
        res.redirect(`userdata/${username}`)
    })

router
    .route('/userdata/:username')
    .get(async(req,res) => {
        let username = req.params.username;
        let user = await getUser(username, "users");
        console.log(user)
        res.render('staff/basicUserData', { user: user});
    })

module.exports = router