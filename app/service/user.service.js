const db = require('../models');
const { Op } = require('sequelize')
const bcrypt = require("bcryptjs");
const User = db.user;


const FindUserByEmailOrUsername = async (email, username) => {
    const user = await User.findOne({
        where: {
            [Op.or]: [
                { username: username },
                { email: email },
            ],
        },
    })
    return user
}

const InsertUser = async (body) => {
    const user = await User.create({
        cpf: body.cadCpf,
        digit: body.cadDigito,
        email: body.cadEmail,
        username: body.cadLogin,
        nacio: body.cadNacionalidade,
        birth: body.cadNascimento,
        name: body.cadNome,
        password: bcrypt.hashSync(body.cadSenha, 8),
        phone: body.cadTelefone,
        parcelas: body.parcelas,
        plano: body.plano,
        planoTotal: body.planoTotal
    })
    return user
}
const FindUserByCPF = async (cpf) => {
    const user = User.findOne({
        where: {
            [Op.or]: [
                { cpf: cpf },
            ],
        },
    })
    return user
}

const UpdateUserById = async (id, newData) => {
    const user = await User.findByPk(id)
    console.log(newData)
    user.username = newData.username
    user.email = newData.email
    user.phone = newData.phone
    user.save()
    return user
}

module.exports = {
    FindUserByEmailOrUsername,
    FindUserByCPF,
    InsertUser,
    UpdateUserById
}