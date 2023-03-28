const { render } = require('ejs')
const express = require('express')
const session = require('express-session')

const bcrypt = require('bcrypt');
const https = require('https')
const fs = require('fs')
const app = express()
const port = 3000
const saltRounds = 10
const userRouter = require('./routes/user')
const staffRouter = require('./routes/staff')
const { sessionStore } = require('./sql-connection')

const { encrypt, decrypt, userExists, addUser, getUser, addReservation, getReservations, checkPassword, authSession, generateQR, updateUser, uploadUserid, getUserid, deleteAccount, upload 
  } = require('./server-utils');
const exp = require('constants');
  

app.use(session({
    secret: 'pinakamalupetnasikreto',
    resave: false,
    store: sessionStore,
    saveUninitialized: false
}))

app.set("view engine", "ejs")
app.set('Views', [
    __dirname + '/views/admin',
    __dirname + '/views/user'
])

// serve file inside public
app.use(express.static(__dirname+'/id/'))
app.use(express.static("public"))
app.use('/uploads',express.static("uploads"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/user', userRouter)
app.use('/staff', staffRouter)

app.get("/", (req, res) => {
    res.render("index")
})


const opts = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}


https.createServer(opts, app).listen(port)
console.log("Listening to port " + port + ".");

app.route("/login")
    .get((req, res) => {
        res.render("login")
    })  
    .post(async (req, res) => {
        let username = req.body.username
        let password = req.body.password

        let userInUSERS = await userExists(username, "users")
        let userInADMIN = await userExists(username, "admins")
        try{
        if(!userInUSERS && !userInADMIN){
            res.render('login', { message: "User does not exist."})
        } else if (userInUSERS) {
            let user = await getUser(username, "users")
            console.log(user)
            if(user.active == 0){
                res.render('login', { message: "User does not exist."})
            }
            if (!await checkPassword(password, username, "users")){
                res.render('login', { 
                    message: "Incorrect password.", 
                    username : username})
            }
            
            let encryptedUsername = encrypt(user.username);
            req.session.username = encryptedUsername
            req.session.table = "users"
            res.redirect(`user/dash`)
        } else if (userInADMIN) {

            let user = await getUser(username, "admins")
            if(password != user.password){
                res.render('login', { 
                    message: "Incorrect password.", 
                    username : username})
            }
            let encryptedUsername = encrypt(user.username);
            req.session.username = encryptedUsername
            req.session.table = "admins"
            res.redirect(`staff/dash`)
        } 

        }catch(e) {
            console.log("\nError in login.")
            console.error(e)
            res.render('login')
        } 
    })

// ================ LOGOUT ==================

app.get('/logout', authSession, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err)
            return
        }
        res.redirect('/login');
    })
})

app
    .route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post(async (req, res) => {
        let password = req.body.password
        let hashed = await bcrypt.hash(password, saltRounds)
        const user = [req.body.username, hashed, req.body.first_name, req.body.last_name, req.body.sex, req.body.age, req.body.contact_number, req.body.birthday.valueOf(), req.body.email, req.body.address, 1]

        if(!await userExists(user[0], "users")){
            addUser(user)
        } else {
            res.render('register', { message: "Username is already taken."})
        }
        res.redirect('/login')
    })

app
    .route("/delete")
    .get(authSession,(req,res) => {
        res.render("/delete")
    })
