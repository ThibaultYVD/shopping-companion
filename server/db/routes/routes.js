async function routes(app) {
    app.get("/", (req, res) => {
        res.json({ message: "DB Server" });
    });

    /* ROUTES ADMIN */
    const groupsAdmin = require('./admin/groups')
    app.use('/admin/groups/', groupsAdmin)

    const listsAdmin = require('./admin/lists')
    app.use('/admin/lists/', listsAdmin)


    /* ROUTES USERS */
    const groupsRoute = require('./user/groups')
    app.use('/user/groups/', groupsRoute)

    const listsRoute = require('./user/lists')
    app.use('/user/lists/', listsRoute)


    /* A FAIRE */
    const productsRoute = require('./user/products')
    app.use('/user/products/', productsRoute)

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