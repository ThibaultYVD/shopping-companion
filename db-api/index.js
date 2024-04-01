const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
require('dotenv/config')
const db = require("./model");


db.sequelize.sync()

app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "API Database" });
});


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
