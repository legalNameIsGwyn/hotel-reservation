console.log("Server is running.");

const { render } = require('ejs')
const express = require('express')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const https = require('https')
const fs = require('fs')
const jsonParser = express.json()
const app = express()
const port = 3000
const saltRounds = 10
const userRouter = require('./routes/users')

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
  } = require('./server-utils');
  
const options = {    
    host: 'localhost',
    user: 'localuser',
    password: 'password',
    database: 'easytel',
    connectionLimit: 10,
}

const sessionStore = new MySQLStore(options)

app.use(session({
    secret: 'pinakamalupetnasikreto',
    resave: false,
    store: sessionStore,
    saveUninitialized: false
}))

app.set("view engine", "ejs")

// serve file inside public
app.use(express.static("public"))
app.use('/users', userRouter)
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get("/", (req, res) => {
    console.log("User entered index.")
    res.render("index")
})

const opts = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}


https.createServer(opts, app).listen(port)
console.log("Listening to port " + port + ".");

// ================= LOGIN ==================

app.route("/login")
    .get((req, res) => {
        console.log("User entered login.")
        res.render("login")
    })  
    .post(async (req, res) => {
        console.log("Loggin in.")
        let username = req.body.username
        let password = req.body.password

    
        if(!await userExists(username)){
            res.render('login', { message: "User does not exist."})
        }

        let user = await getUser(username)

        if (!await bcrypt.compare(password, user.password)){
            res.render('login', { 
                message: "Incorrect password.", 
                username : username})
        }
        try{

            let username = encrypt(user.username);
            req.session.username = username
            res.redirect('/dashboard')
        
        } catch(e) {
            console.log("\nError in login.")
            console.error(e)
            res.render('login')
        }
    })

// ================ DASHBOARD ==================

app.get("/dashboard", authSession, (req,res) => {
    res.render("dashboard")
})
// ================ LOGOUT ==================

app.get('/logout', authSession, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err)
            return
        }
        console.log(`Log out.`)
        res.redirect('/login');
    })
})
// ================ REGISTER ==================

app
    .route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post(async (req, res) => {
        console.log("Registering")
        let password = req.body.password
        let hashed = await bcrypt.hash(password, saltRounds)
        const user = [req.body.username, hashed, req.body.first_name, req.body.last_name, req.body.sex, req.body.age, req.body.birthday, req.body.contact_number, req.body.email, req.body.address, 1]

        console.log(user)

        if(!await userExists(user[0])){
            addUser(user)
            console.log(`${user[0]} successfully registerd!\n`)
        } else {
            res.render('register', { message: "Username is already taken.",
            first_name: user[2], last_name: user[3], sex: user[4], age: user[5], birthday: user[6], contact_number: user[7], email: user[8], address: user[9], password: password})
        }
        res.redirect('/login')
    })

// ================ HOTELS =================

app
    .route('/hotels')
    .get(authSession,(req, res) => {
        res.render('hotels')
    })
    .post(async (req, res) => {
        let reservation = [req.session.username, req.body.checkin, req.body.checkout]

        addReservation(reservation)
        res.redirect('dashboard')
    })

// ================ RESERVATION =================
app
    .route('/reservations')
    .get(async (req,res) => {
        let reservations = await getReservations(req.session.username)
        res.send(reservations[0])

    })
    .post(async (req, res) => {
        console.log("in reservations_history")

    })

// ================ QR CODE =================
app
    .route('/userQR')
    .get(async (req,res) => {
        
        console.log("in userQR")
        const qrImage = await generateQR(req.session.username);

        res.render('userQR', {qrImage});
    })
    .post(async (req, res) => {
        console.log("in reservations_history")

    })
// ================= STAFF ======================
app
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
app
    .route('/userdata/:username')
    .get(async(req,res) => {
        let username = req.params.username;
        let user = await getUser(username);
        let reservations = await getReservations(username);
        console.log(username)
        console.log(user)
        res.render('userdata', { user: user, bookings: reservations });
    })