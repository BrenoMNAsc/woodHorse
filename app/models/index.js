// db.js
const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importe os modelos e passe a instância sequelize e Sequelize como parâmetros
db.professional = require("./professional.model.js")(sequelize, Sequelize);
db.company = require("./company.model.js")(sequelize, Sequelize);
db.cmpLocalization = require("./cmpLocalization.model.js")(sequelize, Sequelize);
db.cmpSocialMedia = require("./cmpSocialMedia.model.js")(sequelize, Sequelize);
db.jobRecruiter = require("./jobRecruiter.model.js")(sequelize, Sequelize)
db.role = require("./role.model.js")(sequelize, Sequelize);
db.professioalRoles = require("./professionalRoles.model.js")(sequelize, Sequelize);
db.companyRoles = require("./companyRoles.model.js")(sequelize, Sequelize);
db.post = require("./post.model.js")(sequelize, Sequelize);
db.companies_posts = require("./companies_posts.model")(sequelize, Sequelize);
db.course = require("./course.model.js")(sequelize, Sequelize);
db.professional_exp = require('./professional_exp.js')(sequelize, Sequelize);
db.tag = require('./tag.model.js')(sequelize, Sequelize)
db.professional_tags = require('./professional_tags.model.js')(sequelize, Sequelize);
db.post_tags = require('./post_tags.model.js')(sequelize, Sequelize);
db.localization = require('./localization.model.js')(sequelize, Sequelize);
db.image = require("./image.model.js")(sequelize, Sequelize);
db.comments = require("./comments.model.js")(sequelize, Sequelize);
db.post_candidates = require("./post_candidates.model.js")(sequelize, Sequelize)
db.academicInfo = require("./academicInfo.model.js")(sequelize, Sequelize)
db.profSocialMedia = require("./profSocialMedia.model.js")(sequelize, Sequelize)
db.resume = require("./resume.model.js")(sequelize, Sequelize)
db.academicInfo = require("./academicInfo.model.js")(sequelize, Sequelize)
db.cmpLogo = require('./cmpLogo.model.js')(sequelize, Sequelize)

db.professional.hasOne(db.image, {
    foreignKey: 'professionalId',
    onDelete: "CASCADE"
})
db.post.belongsToMany(db.professional, {
    through: db.post_candidates,
    foreignKey: 'postId',
    otherKey: 'professionalId',
    onDelete: "CASCADE"
});

db.professional.belongsToMany(db.post, {
    through: db.post_candidates,
    foreignKey: 'professionalId',
    otherKey: 'postId',
    onDelete: "CASCADE"
});
db.professional.hasOne(db.localization, {
    foreignKey: 'professionalId',
    onDelete: 'CASCADE'
})
db.professional.hasOne(db.academicInfo, {
    as: 'AcademicInfo',
    foreignKey: 'professionalId',
    onDelete: 'CASCADE'
})

db.professional.hasOne(db.resume, {
    foreignKey: 'professionalId',
    onDelete: 'CASCADE'
})

db.professional.hasOne(db.profSocialMedia, {
    as: 'ProfSocialMedia',
    foreignKey: 'professionalId',
    onDelete: 'CASCADE'
})

db.professional.hasMany(db.course, {
    foreignKey: 'professionalId',
    onDelete: 'CASCADE'
})

db.tag.belongsToMany(db.post, {
    through: db.post_tags,
    onDelete: 'CASCADE',
});
db.post.belongsToMany(db.tag, {
    through: db.post_tags,
    onDelete: 'CASCADE',
});

db.professional.hasMany(db.professional_exp, {
    foreignKey: 'professionalId',
    onDelete: 'CASCADE'
})
db.professional.belongsToMany(db.tag, {
    foreignKey: 'professionalId',
    through: db.professional_tags,
    onDelete: 'CASCADE'
})
db.tag.belongsToMany(db.professional, {
    through: db.professional_tags,
    foreignKey: 'tagId',
    onDelete: 'CASCADE'
})
db.professional.belongsToMany(db.tag, {
    through: db.professional_tags,
    onDelete: 'CASCADE'
})


//Company relationships
db.company.hasMany(db.jobRecruiter, {
    foreignKey: 'companyId',
    onDelete: 'CASCADE',
    as: "JobRecruiter"
})
db.company.hasOne(db.cmpLocalization, {
    foreignKey:'companyId',
    onDelete: 'CASCADE',
    as: 'CmpLocalization'
})
db.company.hasOne(db.cmpSocialMedia, {
    foreignKey:'companyId',
    onDelete: 'CASCADE',
    as: 'CmpSocialMedia'
})
db.company.hasOne(db.cmpLogo,{
    foreignKey:'companyId',
    onDelete:'CASCADE',
    as: "CmpLogo"
})

db.role.belongsToMany(db.company, {
    through: db.companyRoles,
    onDelete: 'CASCADE'
});
db.role.belongsToMany(db.professional, {
    through: db.professioalRoles,
    onDelete: 'CASCADE'
});
db.company.belongsToMany(db.role, {
    through: db.companyRoles,
    onDelete: 'CASCADE'
});
db.professional.belongsToMany(db.role, {
    through: db.professioalRoles,
    onDelete: 'CASCADE'
});
db.post.belongsTo(db.company, {
    foreignKey: 'companyId',
    onDelete: 'CASCADE'
})
db.company.belongsToMany(db.post, {
    through: db.companies_posts,
    foreignKey: 'companiesId',
    otherKey: 'postId',
    onDelete: 'CASCADE'
});

db.ROLES = ["user", "admin", "moderator"];
db.TYPEOFUSER = {
    professional: "professional",
    companies: "companies",
    stundent: "student",
    university: "university"
}

module.exports = db;
