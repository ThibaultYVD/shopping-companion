const Group = require("./Group");

module.exports = (sequelize, Sequelize) => {
    const List = sequelize.define("lists", {
        list_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        list_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        group_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Group,
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
        }
        
    });

    return List;
};