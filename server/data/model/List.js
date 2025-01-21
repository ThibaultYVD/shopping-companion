const Group = require("./Group");
const Supermarket = require("./Supermarket");

module.exports = (sequelize, Sequelize) => {
    const List = sequelize.define("lists", {
        list_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        list_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        group_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users_groups",
                key: 'group_id'
            }
        },
        creation_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        shopping_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        supermarket_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "supermarkets",
                key: 'supermarket_id'
            }
        }
    }, {
        timestamps: false
    });

    return List;
};