require('dotenv/config')
const express = require("express")
const app = express()
const cors = require("cors")
const db = require("./model");
const bodyParser = require('body-parser')

db.sequelize.sync()

app.use(express.json());
app.use(bodyParser.json())
app.use(cors())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const productsRoute = require('./routes/products')
app.use('/products/', productsRoute)


app.get("/", (req, res) => {
    res.json({ message: "API Database" });
});


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
