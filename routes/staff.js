const express = require('express')
const router = express.Router()

const QrCode = require('qrcode-reader');
const Jimp = require('jimp');
const fs = require('fs');


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
    .post((req,res) => {
        console.log("qrcode received")
        console.log(req.body)
    })

module.exports = router
