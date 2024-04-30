const express = require("express")
const app = express()
const cors = require("cors")
const cookieSession = require("cookie-session")
app.use(cors())
require('dotenv/config')
const db = require("./model");

// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });

db.sequelize.sync()

app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: "website-session",
        keys: [process.env.SECRET_KEY],
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24h
    })
);

app.get("/", (req, res) => {
    res.json({ message: "Auth Server" });
});


// Routes
require('./routes/auth')(app)
require('./routes/user')(app);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
