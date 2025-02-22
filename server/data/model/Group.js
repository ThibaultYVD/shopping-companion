const User = require("./User");

module.exports = (sequelize, Sequelize) => {
    const Group = sequelize.define("users_groups", {
        group_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        group_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        creation_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: 'user_id'
            }
        },
        invitation_code: {
            type: Sequelize.STRING,
            allowNull: true
        },
        is_open:{
            type: Sequelize.STRING,
            allowNull: false
        }
    },{
        timestamps:false
    });

    return Group;
};