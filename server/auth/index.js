const express = require("express")
const app = express()
const cors = require("cors")

const session = require('express-session');
const cookieSession = require("cookie-session")

app.use(cors())
require('dotenv/config')
const db = require("./model/Models");

// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });

db.sequelize.sync()

app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/*
app.use(cookieSession({
        name: "website-session",
        keys: [process.env.SECRET_KEY],
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24h
    })
);
*/

app.use(session({
    secret: process.env.SECRET_KEY, // Utilisez une clé secrète pour signer le cookie de session
    resave: false, // Ne pas sauvegarder la session si elle n'est pas modifiée
    saveUninitialized: false, // Ne pas créer de session jusqu'à ce qu'il y ait des données à sauvegarder
    cookie: {
        //secure: process.env.NODE_ENV === 'production', // Cookie sécurisé en production
        httpOnly: true, // Empêche l'accès au cookie par JavaScript côté client
        maxAge: 24 * 60 * 60 * 1000 // 30 minutes
    }
}));

app.get("/", (req, res) => {
    res.json({ message: "Auth Server" });
});


// Routes
require('./routes/auth')(app)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
