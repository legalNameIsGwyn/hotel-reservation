const express = require('express')
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
// ================= STAFF ======================
router
    .route("/staff/readQR")
    .get((req,res) => {
        console.log("staff in readQR")
        res.render("readQR")
    })
    .post(jsonParser, async (req, res) => {
        let username = await decrypt(req.body.text)
        res.redirect(`/userdata/${username}`)
    })
        // let decodedText = decrypt(req.body.text)
        // console.log(decodedText)
router
    .route('/userdata/:username')
    .get(async(req,res) => {
        let username = req.params.username;
        let user = await getUser(username);

        res.render('basicUserData', { user: user});
    })
module.exports = router