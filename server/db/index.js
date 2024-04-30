require('dotenv/config')
const express = require("express")
const app = require("./routes/routes")
const cors = require("cors")
const db = require("./model/Models");
const bodyParser = require('body-parser')
const session = require('express-session')

db.sequelize.sync()

app.use(express.json());
app.use(bodyParser.json())
app.use(cors())
app.use(session({
    secret: process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: true
}));



// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});