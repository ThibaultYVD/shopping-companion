async function routes(app) {
    app.get("/", (req, res) => {
        res.json({ message: "DB Server" });
    });

    /* ROUTES ADMIN */
    const groupsAdmin = require('./admin/groups')
    app.use('/admin/groups/', groupsAdmin)


    /* ROUTES USERS */
    const groupsRoute = require('./user/groups')
    app.use('/user/groups/', groupsRoute)

    const listsRoute = require('./user/lists')
    app.use('/user/lists/', listsRoute)

    const productsRoute = require('./products')
    app.use('/products/', productsRoute)

    const rolesRoute = require('./roles')
    app.use('/roles/', rolesRoute)

    const shelvesRoute = require('./shelves')
    app.use('/shelves/', shelvesRoute)

    const supermarketsRoute = require('./supermarkets')
    app.use('/supermarkets/', supermarketsRoute)

    const authRoute = require('./auth')
    app.use('/auth/', authRoute)
}


module.exports = routes