const express = require('express');
const app = express()

app.get("/", (req, res) => {
    res.json({ message: "DB Server" });
});

const productsRoute = require('./products')
app.use('/products/', productsRoute)

const groupsRoute = require('./groups')
app.use('/groups/', groupsRoute)

const listsRoute = require('./lists')
app.use('/lists/', listsRoute)

const rolesRoute = require('./roles')
app.use('/roles/', rolesRoute)

const shelvesRoute = require('./shelves')
app.use('/shelves/', shelvesRoute)

const supermarketsRoute = require('./supermarkets')
app.use('/supermarkets/', supermarketsRoute)

const authRoute = require('./auth')
app.use('/auth/', authRoute)

module.exports = app