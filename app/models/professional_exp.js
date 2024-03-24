module.exports = (sequelize, Sequelize) => {
    const ProfessionalExp = sequelize.define("professional_exp", {
        ocupation: {
            type: Sequelize.STRING
        },
        company: {
            type: Sequelize.STRING
        },
        desc: {
            type: Sequelize.TEXT
        },
        startDate: {
            type: Sequelize.STRING
        },
        endDate: {
            type: Sequelize.STRING
        },
    });
    return ProfessionalExp;
};