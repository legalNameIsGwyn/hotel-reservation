const express = require('express')
const router = express.Router()


router
    .route("/")
    .get((req,res) => {
        res.send("You are in a staff page.")
    })

router
    .route("/readQR")
    .get((req,res) => {
        console.log("staff in readQR")
        res.render("readQR")
    })

module.exports = router
