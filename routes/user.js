const express = require('express')
const router = express.Router()
const multer = require('multer')
const {
    getUser,
    addReservation,
    getReservations,
    authSession,
    generateQR,
    decrypt,
    updateUser
    } = require('../server-utils');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
router
    .route('/dash')
    .get(authSession, (req, res) => {
        res.render('user/userDash')
    })
    .post(authSession, (req, res) => {
        
    })

// ================ HOTELS =================

router
    .route('/hotels')
    .get(authSession,(req, res) => {
        res.render('user/hotels')
    })
    .post(authSession,async (req, res) => {
        let reservation = [req.session.username, req.body.checkin, req.body.checkout]

        addReservation(reservation)
        res.redirect('user/dash')
    })

// ================ RESERVATION =================
router
    .route('/reservations')
    .get(authSession, async (req,res) => {
        let reservations = await getReservations(req.session.username)
        res.send(reservations)

    })
    .post(authSession, async (req, res) => {
        console.log("in reservations_history")

    })
// ================ QR CODE =================
router
    .route('/userQR')
    .get(authSession, async (req,res) => {
        const qrImage = await generateQR(req.session.username);
        res.render('user/userQR', {qrImage});
    })

// ================= PORFILE ==================

router
    .route('/profile')
    .get(authSession,async (req,res) => {
        let username = await decrypt(req.session.username)
        let user = await getUser(username, "users")
        let bookings = await getReservations(username)
        res.render('user/profile', {user : user, bookings : bookings})
    })

// ================= POINTS ==================

router
    .route('/points')
    .get(authSession, (req,res) => {
        res.render('user/points')
    })

router
    .route('/edit')
    .get(authSession, async (req, res) => {
        const userData = req.body;
      
        // Save user data to users table
        saveUserDataToUsersTable(userData, (err, result) => {
            const user = {
                first_name: userData.first_name,
                last_name: userData.last_name,
                sex: userData.sex,
                age: userData.age,
                birthday: userData.birthday,
                contact_number: userData.contact_number,
                email: userData.email,
                address: userData.address
            };

          if (err) {
            console.error(err);
            res.status(500).send('Error saving user data to users table');
            return;
          }
      
          // Check if image files were uploaded
          if (req.files) {
            // Save image data to user ID table
            const userId = result.insertId;
            saveImageDataToUserIdTable(userId, req.files, (err) => {
              if (err) {
                console.error(err);
                res.status(500).send('Error saving image data to user ID table');
                return;
              }
      
              res.status(200).send('Data saved successfully!');
            });
          } else {
            // If no files were uploaded, send success response
            res.status(200).send('Data saved successfully!');
          }
        });
      });

// save user data to users table
function saveUserDataToUsersTable(userData, callback) {
    // save user data to users table
    // ...
    callback(null, { insertId: 1 }); // simulate successful database insertion
}

// save image data to user ID table
function saveImageDataToUserIdTable(userId, files, callback) {
    // save image data to user ID table
    // ...
    callback(null); // simulate successful database insertion
}

module.exports = router