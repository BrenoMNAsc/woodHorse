const { FindUserByEmailOrUsername, FindUserByCPF } = require('../service/user.service')
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        let user;
        console.log(JSON.stringify(req.body))
        user = await FindUserByEmailOrUsername(req.body.cadEmail, req.body.cadLogin);
        if (user) {
            return res.send({
                message: "Falha!, usuário já cadastrado"
            }).status(400);
        }
        else if (req.body.cpf) {
            user = await FindUserByCPF(req.body.cadCpf);
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
