const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { InsertUser, FindUserByEmailOrUsername, UpdateUserById } = require('../service/user.service');


exports.signup = async (req, res) => {
    try {
        const body = req.body
        const user = await InsertUser(body)
        return res.send({ message: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Erro no servidor' });
    }
}


exports.signin = async (req, res) => {
    try {
        let user = await FindUserByEmailOrUsername('', req.body.meuLogin)
        if (!user) return res.status(404).send({ message: 'Usuário não encontrado' })
        const passwordIsValid = bcrypt.compareSync(
            req.body.minhaSenha,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Senha incorreta!" });
        }
        const accessToken = jwt.sign(
            { id: user.id },
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: '1h',
            });
        const refreshToken = jwt.sign(
            { id: user.id },
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: '1d',
            });
        return res.status(200)
            .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
            .header('Authorization', accessToken)
            .send({
                id: user.id,
                username: user.username,
                phone: user.phone,
                email: user.email,
                nacio: user.nacio,
                cpf: user.cpf,
                name: user.name,
                plano: user.plano,
                parcelas: user.parcelas,
                planoTotal: user.planoTotal,
                message: "Usuário logado com sucesso.",
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}


exports.update = async (req, res) => {
    try {
        const userId = req.body.id;
        const newData = {
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone
        }
        const user = await UpdateUserById(userId, newData)
        return res.send({ message: 'Usuário atualizado!', ...user })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}