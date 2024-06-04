async function routes(app) {
    app.get("/", (req, res) => {
        res.json({ message: "DB Server" });
    });

    /* ROUTES ADMIN */
    const groupsAdmin = require('./admin/groups')
    app.use('/admin/groups/', groupsAdmin)

    const listsAdmin = require('./admin/lists')
    app.use('/admin/lists/', listsAdmin)

    const productsAdmin = require('./admin/products')
    app.use('/admin/products/', productsAdmin)

    const rolesRoute = require('./admin/roles')
    app.use('/admin/roles/', rolesRoute)

    const shelvesRoute = require('./admin/shelves')
    app.use('/admin/shelves/', shelvesRoute)

    const supermarketsRoute = require('./admin/supermarkets')
    app.use('/supermarkets/', supermarketsRoute)


    /* ROUTES USERS */
    const groupsRoute = require('./user/groups')
    app.use('/user/groups/', groupsRoute)

    const listsRoute = require('./user/lists')
    app.use('/user/lists/', listsRoute)

    const productsRoute = require('./user/products')
    app.use('/user/products/', productsRoute)

    const usersRoute = require('./user/users')
    app.use('/user/users/', usersRoute)


    /* ROUTE AUTH */
    const authRoute = require('./auth')
    app.use('/auth/', authRoute)
}


module.exports = routes