const db = require('../models');
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        let user;
        console.log(JSON.stringify(req.body))
        user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.cadLogin },
                    { email: req.body.cadEmail },
                ],
            },
        });
        if (user) {
            return res.send({
                message: "Falha!, usuário já cadastrado"
            }).status(400);
        }
        else if (req.body.cpf) {
            user = await User.findOne({
                where: {
                    [Op.or]: [
                        { cpf: req.body.cadCpf },
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

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
