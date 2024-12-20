const express = require('express');
const bodyParser = require('body-parser');
const sql = require('msnodesqlv8');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection string
const connectionString = require('./dbConfig');

// Test database connection on startup
sql.open(connectionString, (err, pool) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("Database connected");
    }
});

// ROUTES
app.get('/home', (req, res) => {
    res.render('flight');
});

app.get('/payment', (req, res) => {
    res.render('payment');
});

app.get('/customers_details', (req, res) => {
    res.render('customers_details');
});

app.get('/booking', (req, res) => {
    res.render('booking');
});

app.get('/aboutes', (req, res) => {
    res.render('aboutes');
});

app.get('/abouts', (req, res) => {
    res.render('abouts');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/deal', (req, res) => {
    res.render('deal');
});

app.get('/end', (req, res) => {
    res.render('end');
});


          // Register Route
app.post('/register', async (req, res) => {
    const { fullName, lastName, userName, contact, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Email and password are required.");
    }

    const checkQuery = "SELECT * FROM users WHERE email = ?";
    sql.query(connectionString, checkQuery, [email], async (err, rows) => {
        if (err) {
            console.error("Error checking for existing user:", err);
            return res.status(500).send("An error occurred while checking for existing users.");
        }

        if (rows.length > 0) {
            console.error("User already exists with email:", email);
            return res.status(400).send("This email is already registered.");
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = `
                INSERT INTO users (full_name, last_name, user_name, contact, email, password)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            sql.query(connectionString, insertQuery, [fullName, lastName, userName, contact, email, hashedPassword], (err) => {
                if (err) {
                    console.error("Registration error:", err);
                    return res.status(500).send("An error occurred during registration.");
                }
                console.log("User registered successfully:", email);
                res.redirect('/home');
            });
        } catch (error) {
            console.error("Hashing or registration error:", error);
            res.status(500).send("An error occurred during registration.");
        }
    });
});




           // Login Route
// app.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).send("Email and password are required.");
//     }

//     const checkQuery = "SELECT * FROM users WHERE email = ?";
//     sql.query(connectionString, checkQuery, [email], async (err, rows) => {
//         if (err) {
//             console.error("Error checking for existing user:", err);
//             return res.status(500).send("An error occurred while checking for users.");
//         }

//         if (rows.length === 0) {
//             console.log("User not found with email:", email);
//             // return res.status(400).send("User not found.");
//             return res.status(400).json({ success: false, message: "User not found. Please sign up first." });

//         }

//         const user = rows[0];
//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             console.log("Invalid password for email:", email);
//             // return res.status(400).send("Invalid password.");
//             return res.status(400).json({ success: false, message: "Invalid password." });

//         }

//         console.log("User logged in successfully:", email);
//         res.redirect('/booking');
//     });
// });
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const checkQuery = "SELECT * FROM users WHERE email = ?";
    sql.query(connectionString, checkQuery, [email], async (err, rows) => {
        if (err) {
            console.error("Error checking for existing user:", err);
            return res.status(500).json({ success: false, message: "An error occurred while checking for users." });
        }

        if (rows.length === 0) {
            console.log("User not found with email:", email);
            return res.status(400).json({ success: false, message: "User not found. Please sign up." });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Invalid password for email:", email);
            return res.status(400).json({ success: false, message: "Invalid password. Please try again." });
        }

        console.log("User logged in successfully:", email);
        res.json({ success: true });
    });
});
  
app.get('/isLoggedIn', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ isLoggedIn: true }); // User is logged in
    } else {
        res.json({ isLoggedIn: false }); // User is not logged in
    }
});

app.get('/booking', (req, res) => {
    if (req.session && req.session.user) {
        res.render('booking'); // Render the booking page
    } else {
        res.redirect('/login'); // Redirect to login page if not logged in
    }
});



        //BOOKING
        app.post('/booking', (req, res) => {
            const { user_name, source_city, designated_city, departed_date, Class, number_of_people } = req.body;
        
            const bookingData = {
                user_name,
                source_city,
                designated_city,
                departed_date,
                Class,
                number_of_people
            };
        
            const bookingQuery = `
                INSERT INTO BookingDetails (user_name, source_city, designated_city, departed_date, Class, number_of_people)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            sql.query(connectionString, bookingQuery, [user_name, source_city, designated_city, departed_date, Class, number_of_people], (err) => {
                if (err) {
                    console.error("Error inserting booking details:", err);
                    return res.status(500).send("Error inserting booking details.");
                }
        
                console.log("Booking details inserted successfully");
                res.redirect('/customers_details');
            });
        });
        




// Handle POST request for form submission
app.post('/cloned', (req, res) => {
    const formDataArray = req.body; 

    formDataArray.forEach(formData => {
        const { firstname, lastname, username, age, passportnumber } = formData;

        const query = `
            INSERT INTO customer_detail (firstname, lastname, username, age, passportnumber)
            VALUES (?, ?, ?, ?, ?)
        `;

        sql.query(connectionString, query, [firstname, lastname, username, age, passportnumber], (err) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error inserting customer details.');
            }

            console.log('Customer details inserted successfully');
        });
    });

    res.status(200).send('Customer details submitted successfully.');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});