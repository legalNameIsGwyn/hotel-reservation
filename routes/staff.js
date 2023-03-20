const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
let jsonParser = bodyParser.json()
const { secretKey } = require('../config');
const { decrypt } = require('../server-utils');
  
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
    .post(jsonParser,async (req,res) => {
        console.log(secretKey)
        let decodedText = await decrypt(req.body.text)
        console.log(decodedText)
        
    })

module.exports = router
