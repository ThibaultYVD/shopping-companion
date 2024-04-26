module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
        role_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        role_name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{
        timestamps:false
    });

    return Role;
};