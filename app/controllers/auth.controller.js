const db = require("../models");
const config = require("../config/auth.config");
const User = db.user:
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        const body = req.body
        const user = await User.create({
            cpf: body.cadCpf,
            digit: body.cadDigito,
            email: body.cadEmail,
            username: body.cadLogin,
            nacio: body.cadNacionalidade,
            birth: body.cadNascimento,
            name: body.cadNome,
            password: bcrypt.hashSync(body.cadSenha, 8),
            phone: body.cadTelefone
        })
        return res.send({ message: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Erro no servidor' });
    }
}


exports.signin = async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                username: req.body.meuLogin
            }
        })
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
                bio: user.bio,
                phone: user.phone,
                cellPhone: user.cellPhone,
                email: user.email,
                message: "Usuário logado com sucesso.",
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}
