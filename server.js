console.log("Server is running.");

const { render } = require('ejs')
const express = require('express')
const mysql2 = require('mysql2')
const app = express()
const port = 2077
const userRouter = require('./routes/users')

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'easytel'
})

app.set("view engine", "ejs")

// serve file inside public
app.use(express.static("public"))
app.use('/users', userRouter)
app.use(express.urlencoded({extended: true}))


app.get("/", (req, res) => {
    console.log("User entered index.")
    res.render("index")
})

// ================= GET ==================

app.get("/login", (req, res) => {
    console.log("User entered login.")
    res.render("login")
})

app.get("/register", (req, res) => {
    console.log("User entered register.")
    res.render("register");
})

// ================ POST ==================

app.post("/login", (req, res) => {
    console.log("check if user exists")
    res.render("index")
})

app.post("/register", async (req, res) => {
    console.log("Registering")
    const user = [req.body.username, req.body.password, req.body.first_name, req.body.last_name, req.body.sex, req.body.age, req.body.birthday, req.body.contact_number, req.body.email, req.body.address, 1]

    console.log(user)

    if(!await userExists(user[0])){
        addUser(user)
        console.log(`${user[0]} successfully registerd!\n`)
    }
    res.redirect('/login')
})

app.listen(2077);
console.log("Listening to port " + port + ".");

// ================ FUNCITONS =================

async function userExists(username) {
    console.log("Checking if user exists.")
    try {
        const [rows] = await connection.promise().query(
            'SELECT * FROM users WHERE username = ?',
            [username])
        return rows.length > 0

    } catch (error) {
        console.error(error);
        console.log('There was an error in userExists')
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