module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        cpf: {
            type: Sequelize.STRING
        },
        digit: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        nacio: {
            type: Sequelize.STRING
        },
        birth: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        plano: {
            type: Sequelize.STRING
        },
        parcelas: {
            type: Sequelize.STRING
        },
        planoTotal: {
            type: Sequelize.STRING
        }
    });
    return User;
};