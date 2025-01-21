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

    const rolesAdmin = require('./admin/roles')
    app.use('/admin/roles/', rolesAdmin)

    const shelvesAdmin = require('./admin/shelves')
    app.use('/admin/shelves/', shelvesAdmin)

    const supermarketsAdmin = require('./admin/supermarkets')
    app.use('/supermarkets/', supermarketsAdmin)


    /* ROUTES USERS */
    const groupsRoute = require('./user/groups')
    app.use('/user/groups/', groupsRoute)

    const listsRoute = require('./user/lists')
    app.use('/user/lists/', listsRoute)

    const productsRoute = require('./user/products')
    app.use('/user/products/', productsRoute)

    const supermarketsRoute = require('./user/supermarkets')
    app.use('/user/supermarkets/', supermarketsRoute)

    const usersRoute = require('./user/users')
    app.use('/user/users/', usersRoute)

    const dijkstra = require('./dijkstra')
    app.use('/dijkstra/', dijkstra)
}


module.exports = routes