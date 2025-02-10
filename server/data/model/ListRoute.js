const List = require("./List");

module.exports = (sequelize, Sequelize) => {
    const ListRoute = sequelize.define("list_routes", {
        list_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'lists', 
                key: 'list_id'
            },
            allowNull: false
        },
        route: {
            type: Sequelize.JSON,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false
        },
    },{
        timestamps:false
    });

    return ListRoute;
};