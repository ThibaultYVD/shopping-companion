const User = require("./User");

module.exports = (sequelize, Sequelize) => {
    const Group = sequelize.define("groupes", {
        group_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
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
                model: User,
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