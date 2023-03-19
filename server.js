console.log("Server is running.");

const { render } = require('ejs')
const express = require('express')
const mysql2 = require('mysql2')

const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const app = express()
const port = 3000
const saltRounds = 10
const userRouter = require('./routes/users')

const options = {    
    host: 'localhost',
    user: 'localuser',
    password: 'password',
    database: 'easytel',
    connectionLimit: 10,
}

const connection = mysql2.createPool(options)
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

app.get("/", (req, res) => {
    console.log("User entered index.")
    res.render("index")
})

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

        let user = await getUser(username)

        if(!await userExists(username)){
            res.render('login', { message: "User does not exist."})
        }

        if (!await bcrypt.compare(password, user.password)){
            res.render('login', { 
                message: "Incorrect password.", 
                username : username})
        }
        try{
            const first_name = user.first_name;
            req.session.name = first_name;
            res.redirect('/dashboard')
        
        } catch {
            console.log("Error in login.")

            res.render('login')
        }
    })

// ================ DASHBOARD ==================

app.get("/dashboard", authSession, (req,res) => {
    console.log(req.session.name);
    res.render("dashboard", { name: req.session.name})
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

app.listen(port);
console.log("Listening to port " + port + ".");

// ================ FUNCITONS =================

async function userExists(username) {
    console.log("Checking if user exists.")
    try {
        const [rows] = await connection.promise().execute(
            'SELECT * FROM users WHERE username = ?', [username]
        )
        return rows.length > 0

    } catch (error) {
        console.error(error);
        console.log('\nThere was an error in userExists\n')
        // Return false if there is an error
        return false;
    }
}

async function addUser(user) {
    try {
        // Insert new user into students
        await connection.execute(
            'INSERT INTO users (username, password, first_name, last_name, sex, age, contact_number, birthday, email, address, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            user
        );
        console.log(`User ${user[0]} added to users`)
        
        } catch (error) {
            console.error(error);
            console.log('Error in addUser')
    }
}

async function getUser(username){
    try {
        // Insert new user into students
        let [rows, fields] = await connection.promise().query(
            'SELECT * FROM users WHERE username = ?', [username]
        );
        return rows[0];
        } catch (error) {
            console.error(error);
            console.log('Error in getUser');
    }
}

function authSession(req, res, next){
    if (req.session && req.session.name) {
        next();
    } else {
        res.redirect('/login');
    }
}
