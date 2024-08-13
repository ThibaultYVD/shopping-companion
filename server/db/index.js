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
    secret: process.env.SECRET_KEY, 
    resave: false, 
    saveUninitialized: false,
    cookie: {
        //secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(cookieParser());

routes(app)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
