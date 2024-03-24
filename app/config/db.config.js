require('dotenv/config');

module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USERDB,
    PASSWORD: process.env.PASSDB,
    DB: process.env.DBNAME,
    dialect: process.env.DIALECT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};