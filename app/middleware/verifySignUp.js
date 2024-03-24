const db = require('../models');
const ROLES = db.ROLES;
const TYPEOFUSER = db.TYPEOFUSER;
const Professional = db.professional;
const Company = db.company;
const Op = db.Sequelize.Op;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        let user;
        console.log(JSON.stringify(req.body))
        user = await Professional.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.username },
                    { email: req.body.email },
                ],
            },
        });
        if (user) {
            return res.send({
                message: "Falha!, usuário já cadastrado"
            }).status(400);
        }
        else if (req.body.cpf) {
            user = await Professional.findOne({
                where: {
                    [Op.or]: [
                        { cpf: req.body.cpf },
                    ],
                },
            });
            if (user) {
                return res.send({
                    message: "Falha!, usuário já cadastrado"
                }).status(400);
            }
        }

        user = await Company.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.username },
                    { email: req.body.email },
                ],
            },
        });
        if (user) {
            return res.send({
                message: "Falha!, usuário já cadastrado"
            }).status(400);
        }
        else if (req.body.cnpj) {
            user = await Company.findOne({
                where: {
                    [Op.or]: [
                        { cnpj: req.body.cnpj },
                    ],
                },
            });
            if (user) {
                return res.send({
                    message: "Falha!, usuário já cadastrado"
                }).status(400);
            }
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Internal server error."
        });
    }
};

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).send({
                    message: `Failure! Role does not exist: ${req.body.roles[i]}`
                });
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;
