const db = require("../models");
const config = require("../config/auth.config");
const TYPEOFUSER = db.TYPEOFUSER;
const Professional = db.professional;
const CmpLocalization = db.cmpLocalization;
const Company = db.company;
const ProfSocialMedia = db.profSocialMedia;
const CmpSocialMedia = db.cmpSocialMedia;
const CmpLogo = db.cmpLogo;
const AcademicInfo = db.academicInfo;
const Role = db.role;
const Image = db.image;
const Localization = db.localization
const Op = db.Sequelize.Op;
const Tag = db.tag;
const Resume = db.resume
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.updateUser = async (req, res) => {
    try {
        let user;
        const updatedUser = req.body.updatedUser;

        switch (updatedUser.typeOfUser) {
            case TYPEOFUSER.professional:
                user = await Professional.findByPk(updatedUser.id);
                break;
            case TYPEOFUSER.companies:
                user = await Companies.create(updatedUser.id);
                break;
        }

        for (const key in updatedUser) {
            if (updatedUser.hasOwnProperty(key)) {
                if (user[key] !== updatedUser[key]) {
                    user[key] = updatedUser[key];
                }
            }
        }

        await user.save();

        return res.send({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Ocorreu um erro ao atualizar profissional.",
        });
    }
};

exports.signupProfessional = async (req, res) => {
    try {
        const user = await Professional.create({
            aboutMe: req.body.aboutMe,
            dateOfBirth: req.body.dateOfBirth,
            nationality: req.body.nationality,
            gender: req.body.gender,
            ethnicRacialOrigin: req.body.ethnicRacialOrigin,
            fullName: req.body.fullName,
            username: req.body.username,
            email: req.body.email,
            alternativeEmail: req.body.alternativeEmail,
            password: bcrypt.hashSync(req.body.password, 8),
            isPcd: req.body?.isPcd,
            typeOfPcD: req.body?.typeOfPcD,
            phone: req.body?.phone,
            cellPhone: req.body?.cellPhone,
            cpf: req.body.cpf,
            registration: req.body.registration
        })

        const tags = JSON.parse(req.body.tags)
        tags.forEach(async tag => {
            let tagRes = await Tag.findOne({
                where: { tagName: tag }
            })
            if (tagRes) {
                user.setTags(tagRes)
            } else {
                return res.status(500).send('Tag não existente ' + tag)
            }
        });
        const localization = await Localization.create({
            cep: req.body.cep,
            neighborhood: req.body.neighborhood,
            address: req.body.address,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            number: req.body.number
        })
        const socialMedia = await ProfSocialMedia.create({
            instagram: req.body?.instagram,
            lattes: req.body?.lattes,
            facebook: req.body.facebook,
            whatsapp: req.body?.whatsapp,
            linkedin: req.body?.linkedin,
            twitter: req.body?.twitter
        })
        const academicInfo = await AcademicInfo.create({
            level: req.body.level,
            status: req.body.status,
            course: req.body.course,
            graduationYear: req.body.graduationYear,
            institution: req.body.institution,
            institutionState: req.body.institutionState
        })
        const img = await Image.create({
            path: req.files.img[0].path,
            file: req.files.img[0].filename
        })
        const resume = await Resume.create({
            path: req.files.pdf[0].path,
            filename: req.files.pdf[0].filename
        })
        await user.setImage(img)
        await user.setResume(resume)
        await user.setLocalization(localization);
        await user.setProfSocialMedia(socialMedia)
        await user.setAcademicInfo(academicInfo)
        return res.send({ message: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Erro no servidor' });
    }
}

exports.signupCompany = async (req, res) => {
    try {
        const user = await Company.create({
            desc: req.body.desc,
            email: req.body.email,
            alternativeEmail: req.body?.alternativeEmail,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            companyName: req.body.companyName,
            cnpj: req.body.cnpj,
            fundationDate: req.body.fundationDate,
            originCountry: req.body.originCountry,
            phone: req.body?.phone,
            cellPhone: req.body.cellPhone
        })
        const localization = await CmpLocalization.create({
            cep: req.body.cep,
            neighborhood: req.body.neighborhood,
            address: req.body.address,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            number: req.body.number
        })
        const socialMedia = await CmpSocialMedia.create({
            instagram: req.body?.instagram,
            facebook: req.body.facebook,
            linkedin: req.body?.linkedin,
        })
        const logo = await CmpLogo.create({
            path: req.files.logo[0].path,
            file: req.files.logo[0].filename
        })
        await user.setCmpLogo(logo)
        await user.setCmpLocalization(localization);
        await user.setCmpSocialMedia(socialMedia)
        return res.send({ message: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Erro no servidor' });
    }
}

exports.signin = async (req, res) => {
    try {
        let user = await Professional.findOne({
            where: {
                username: req.body.username
            }
        })
        if (!user) {
            user = await Company.findOne({
                where: {
                    username: req.body.username
                }
            })
        }
        if (!user) return res.status(404).send({ message: 'Usuário não encontrado' })
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
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
