const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.send("you're logged in")
})

router
    .route("/:username")
    .get((req, res) =>{
        res.send(`${req.params.username}`)
    })
    .post((req, res) => {

    })
    
router.get('/:username/:name', (req, res) => {
    res.send(`${req.params.name} has logged in.`)
})

module.exports = router