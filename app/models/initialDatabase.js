const db = require(".");
const bcrypt = require("bcryptjs");

async function createProfessional(username, email, i) {
  const professional = await db.professional.create({
    username: username,
    fullName: `Nome ${i}`,
    bio: null,
    contactNumber: "88997259807",
    email: email,
    password: bcrypt.hashSync("sua_senha_comum", 8), // Use a senha comum aqui
    typeOfUser: "professional",
    cpf: "07797934325",
    isStudent: false,
    schoolLevel: null,
    urlPicture: null,
  });
  return professional;
}

async function createLocation(cep, address, complement, neighborhood, city, state, number, company) {
  if (company) {
    const local = await db.cmpLocalization.create({
      cep: cep,
      address: address,
      complement: complement,
      neighborhood: neighborhood,
      city: city,
      state: state,
      number: number,
    });
    return local;
  } else {
    const local = await db.localization.create({
      cep: cep,
      address: address,
      complement: complement,
      neighborhood: neighborhood,
      city: city,
      state: state,
      number: number,
    });
    return local;
  }
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function createPosts(jobVacancies, userTags, companyUsers) {
  try {
    const createdPosts = [];
    const numCompanies = companyUsers.length;

    for (let i = 0; i < numCompanies; i++) {
      const postData = jobVacancies[i % jobVacancies.length]; // Use cada um dos dados de jobVacancies ciclicamente
      shuffleArray(userTags); // Embaralhe o array de tags aleatoriamente
      const selectedTags = userTags.slice(0, 5); // Selecione as 5 primeiras tags após embaralhar

      const randomCompanyIndex = Math.floor(Math.random() * numCompanies);
      const companyId = companyUsers[randomCompanyIndex].id; // Associe cada post a uma empresa aleatória

      const post = await db.post.create({
        title: postData.title,
        description: postData.description,
        contactEmail: postData.contactEmail,
        startDate: postData.startDate,
        endDate: postData.endDate,
        companyId: companyId,
      });
      post.setTags(selectedTags); // Associe as tags selecionadas ao post
      createdPosts.push(post);
    }
    return createdPosts;
  } catch (error) {
    throw error;
  }
}

async function createProfessionalExperiences(professionalExpDataArray) {
  try {
    const createdProfessionalExperiences = [];
    for (const professionalExpData of professionalExpDataArray) {
      const professionalExp = await db.professional_exp.create({
        ocupation: professionalExpData.ocupation,
        company: professionalExpData.company,
        desc: professionalExpData.desc,
        startDate: professionalExpData.startDate,
        endDate: professionalExpData.endDate,
      });
      createdProfessionalExperiences.push(professionalExp);
    }
    return createdProfessionalExperiences;
  } catch (error) {
    throw error;
  }
}

async function createCourses(courseDataArray) {
  try {
    const createdCourses = [];
    for (const courseData of courseDataArray) {
      const course = await db.course.create({
        professionalId: courseData.professionalId,
        title: courseData.title,
        institution: courseData.institution,
        desc: courseData.desc,
        startDate: courseData.startDate,
        endDate: courseData.endDate,
      });
      createdCourses.push(course);
    }
    return createdCourses;
  } catch (error) {
    throw error;
  }
}

async function createTag(tagName) {
  const tag = await db.tag.create({
    tagName: tagName,
  });
  return tag;
}

async function createCompany(username, email) {
  const company = await db.company.create({
    username: username,
    fantasyName: "Nome Fantasia da Empresa " + username,
    corporateReason: "Razão Social da Empresa" + username,
    email: email,
    bio: null,
    contactNumber: "88997259807",
    password: bcrypt.hashSync("sua_senha_comum", 8), // Use a senha comum aqui
    typeOfUser: "companies", // Corrigido para 'companies'
    cnpj: "12345678901234", // CNPJ da empresa
    urlPicture: null,
  });
  return company;
}
async function createCompanies(Companies) {
  const companies = [];
  for (const companyData of Companies) {
    const company = await createCompany(companyData.username, email)
    companies.push(company)
  }
  return companies
}

async function createLocations(locations) {
  const localizations = [];
  for (const locationData of locations) {
    const local = await createLocation(
      locationData.cep,
      locationData.address,
      locationData.complement,
      locationData.neighborhood,
      locationData.city,
      locationData.state,
      locationData.number
    );
    localizations.push(local);
  }
  return localizations;
}

const professionalUsers = [];
for (let i = 0; i < 1; i++) {
  professionalUsers.push({ username: `user${i}`, email: `user${i}@exemplo.com` });
}

// Criar várias empresas Company
const companyUsers = [];
for (let i = 0; i < 1; i++) {
  companyUsers.push({ username: `company${i}`, email: `company${i}@exemplo.com` });
}

const courses = [];
for (let i = 0; i < 1; i++) {
  courses.push({
    title: "Desenvolvedor Front-End Júnior",
    description: "Estamos em busca de um desenvolvedor front-end júnior...",
    contactEmail: "contato@empresa1.com",
    startDate: "01/10/23",
    endDate: "31/10/23",
  });
}

async function createTags(programmingTags) {
  const createdUserTags = [];

  for (const tag of programmingTags) {
    const tagUser = await createTag(tag);
    createdUserTags.push(tagUser);
  }

  return createdUserTags;
}
async function createUsers() {
  const jobVacancies = [];
  for (let i = 0; i < 1; i++) {
    jobVacancies.push({
      title: "Desenvolvedor Front-End Júnior",
      description: "Estamos em busca de um desenvolvedor front-end júnior...",
      contactEmail: `contato@empresa${i}.com`,
      startDate: "01/10/23",
      endDate: "31/10/23",
    });
  }

  const programmingTags = [
    "Flutter",
    "JavaScript",
    "Python",
    "Java",
    "C#",
    "Ruby",
    "PHP",
    "Swift",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "HTML",
    "CSS",
    "TypeScript",
    "SQL",
    "MongoDB",
    "Docker",
    "Kubernetes",
    "Git",
    "Android",
    "iOS",
    "AWS",
    "Azure",
    "Firebase",
    "Machine Learning",
    "Artificial Intelligence",
    "Cybersecurity",
    "Blockchain",
    "DevOps",
  ];

  const locations = [];
  for (let i = 0; i < 1; i++) {
    locations.push({
      cep: "12121212",
      address: "Rua da Escola",
      complement: "Ao lado da escola",
      neighborhood: "Educação",
      city: "Cidade dos Estudantes",
      state: "PB",
      number: 121,
    });
  }

  const professionalExperiences = [];
  for (let i = 0; i < 1; i++) {
    professionalExperiences.push({
      ocupation: "Especialista em Marketing Digital",
      company: "Agência de Marketing",
      desc: "Descrição da experiência profissional 20",
      startDate: "02/05/39",
      endDate: "30/11/39",
    });
  }
  const userTags = await createTags(programmingTags);
  const userLocals = await createLocations(locations);
  const userCourses = await createCourses(courses);

  const professionalExp = await createProfessionalExperiences(professionalExperiences);

  const posts = await createPosts(jobVacancies, userTags, companyUsers);
  let i = 0;
  for (const user of professionalUsers) {
    const professionalUser = await createProfessional(user.username, user.email, i);
    professionalUser.setLocalization(userLocals[i]);
    professionalUser.setCourses(userCourses[i]);
    professionalUser.setProfessional_exps(professionalExp[i]);
    i++;

    // Selecionar aleatoriamente 5 tags para cada usuário
    const shuffledTags = userTags.sort(() => Math.random() - 0.5);
    const selectedTags = shuffledTags.slice(0, 5);
    professionalUser.setTags(selectedTags);
  }
  i = 0;
  for (const company of companyUsers) {
    const companyUser = await createCompany(company.username, company.email);
    posts[i].companyId = companyUser.id;
    posts[i].save();
    companyUser.addPost(posts[i]);
    i++;
  }

}
const Role = db.role;

async function initializeDatabase() {
  const companyA = await createCompany('Empresa exemplo A', 'ExemploA@gmail.com')
  const companyB = await createCompany('Empresa exemplo B', 'ExemploB@gmail.com')
  const companyC = await createCompany('Empresa exemplo C', 'ExemploC@gmail.com')
  const companyD = await createCompany('Empresa exemplo D', 'ExemploD@gmail.com')
  const localB = await createLocation('63507235', "Rua exemplo B", "Exemplo CASA", "Exemplares", "Crato", "CE", '1150', true)
  const localA = await createLocation('63507235', "Rua exemplo A", "Exemplo CASA", "Exemplares", "Crato", "CE", '1150', true)
  const localC = await createLocation('63507235', "Rua exemplo C", "Exemplo CASA", "Exemplares", "Crato", "CE", '1150', true)
  const localD = await createLocation('63507235', "Rua exemplo D", "Exemplo CASA", "Exemplares", "Crato", "CE", '1150', true)
  companyA.setCmpLocalization(localA)
  companyB.setCmpLocalization(localB)
  companyC.setCmpLocalization(localC)
  companyD.setCmpLocalization(localD)
  const programmingTags = [
    "Flutter",
    "JavaScript",
    "Python",
    "Java",
    "C#",
    "Ruby",
    "PHP",
    "Swift",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "HTML",
    "CSS",
    "TypeScript",
    "SQL",
    "MongoDB",
    "Docker",
    "Kubernetes",
    "Git",
    "Android",
    "iOS",
    "AWS",
    "Azure",
    "Firebase",
    "Machine Learning",
    "Artificial Intelligence",
    "Cybersecurity",
    "Blockchain",
    "DevOps",
  ];
  const userTags = await createTags(programmingTags);
  const jobVacancies = []
  for (let i = 0; i < 4; i++) {
    jobVacancies.push({
      title: "Desenvolvedor Front-End Júnior",
      description: "Estamos em busca de um desenvolvedor front-end júnior...",
      contactEmail: `contato@empresa${i}.com`,
      startDate: "01/10/23",
      endDate: "31/10/23",
    });
  }
  Role.create({ id: 1, name: "user" });
  Role.create({ id: 2, name: "moderator" });
  Role.create({ id: 3, name: "admin" });

  await createUsers();
  await createPosts(jobVacancies, userTags, [companyA, companyB, companyC, companyD])
}

module.exports = {
  initializeDatabase,
};
