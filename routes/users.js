const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.send("you're logged in staff")
})

router
    .route("/:username")
    .get((req, res) =>{
        res.send(`${req.params.username}`)
    })
    .post((req, res) => {
        
    })
    
router.get('/:username/:name', (req, res) => {
    res.send(`${req.params.username} has logged in.`)
})

module.exports = router