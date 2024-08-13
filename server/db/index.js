require('dotenv/config')
const express = require("express")
const session = require('express-session');
const app = express()
const bodyParser = require('body-parser')
const routes = require('./routes/routes')
const cookieParser = require('cookie-parser');
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const cors = require("cors")
const db = require("./model/Models");


db.sequelize.sync()

app.use(express.json());
app.use(bodyParser.json())
app.use(cors())
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

app.use(cookieParser());

routes(app)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
