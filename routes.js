import { Router } from "express";

//import bcrypt from "bcrypt"
//import mongoose from "mongoose";
import ClientController from "./controllers/ClientController.js";
import DoctorController from "./controllers/DoctorController.js";
import AttendantController from "./controllers/AttendantController.js";
import LoginController from "./controllers/LoginController.js";
import ConsultationController from "./controllers/ConsultationController.js";
import ProfileController from "./controllers/ProfileController.js";

// import Consultation from "./controllers/ConsultationController.js"
// import UserModel from "./models/User.js";
import auth from "./middleware/auth.js";

const routes = new Router();

//Rotas
routes.get("/", async (req, res) => {
    /*await UserModel.discriminator('Admin', new mongoose.Schema({ senha: String })).create({
        email: "admin@sistema.com",
        senha: bcrypt.hashSync("******", 7)
    });*/
  res.send("Bem vindo ao Sistema!");
});

//Login no Sistema
routes.post("/login", LoginController.login);

//Rotas de acesso do perfil
routes.get('/profile', auth(["Doctor", "Attendant", "Admin"]), ProfileController.list);
//Editar usuário logado\
routes.put('/profile', auth(["Doctor", "Attendant", "Admin"]), ProfileController.update);
//Deletar usuário logado 
routes.delete('/profile', auth(["Doctor", "Attendant", "Admin"]), ProfileController.delete);
//Listar todas as consultas do médico logado
routes.get('/profile/consultas', auth(["Doctor"]), ProfileController.listConsultas);

//Listar todas as consultas (De maneira genérica)
routes.get("/consultas", auth(["Admin", "Attendant"]), ConsultationController.list);
//Listar uma consulta
routes.get("/consultas/:cid", auth(["Admin", "Attendant", "Doctor"]), ConsultationController.listOne);
//Criação de consultas pelo médico
routes.post("/consultas", auth(["Doctor"]), ConsultationController.create);
//Edição de consultas pelo atendente/médico
routes.put("/consultas/:cid", auth(["Attendant", "Doctor"]),ConsultationController.update);
//Deleção de consultas (Uso do admin)
routes.delete("/consultas/:cid", auth(["Admin"]), ConsultationController.delete);


/* Bloco de controle de agentes do sistema */

//Cadastro e controle de clientes
// GET /clients > Listar clientes
routes.get("/clients", auth(["Admin", "Attendant"]), ClientController.list);
// GET /clients/:id > Listar um cliente
routes.get("/clients/:pid", auth(["Admin", "Attendant"]), ClientController.listOne);
// POST /clients > Cadastrar um cliente
routes.post("/clients", auth(["Admin", "Attendant"]), ClientController.create);
// PUT /clients/:id > Atualizar o cadastro de um cliente
routes.put("/clients/:pid", auth(["Admin", "Attendant"]), ClientController.update);
// DELETE /clients/:id > Deletar um cliente
routes.delete("/clients/:pid", auth(["Admin", "Attendant"]), ClientController.delete);

//Cadastro e controle de médicos
// GET /doctors > Listar médicos
routes.get("/doctors", auth(["Admin", "Attendant"]), DoctorController.list);
// GET /doctors/:id > Listar um médico
routes.get("/doctors/:did", auth(["Admin", "Attendant"]), DoctorController.listOne);
// POST /doctors > Cadastrar um médico (Uso do admin)
routes.post("/doctors", auth(["Admin"]), DoctorController.create);
// PUT /doctors/:id > Atualizar o cadastro de um médico (Uso do admin)
routes.put("/doctors/:did", auth(["Admin"]),DoctorController.update);
// DELETE /doctors/:id > Deletar um médico (Uso do admin)
routes.delete("/doctors/:did", auth(["Admin"]), DoctorController.delete);

//Cadastro e controle de atendentes
// GET /attendants > Listar atendentes (Uso do admin)
routes.get("/attendants", auth(["Admin"]), AttendantController.list);
// GET /clients/:id > Listar um atendente (Uso do admin)
routes.get("/attendants/:id", auth(["Admin"]), AttendantController.listOne);
// POST /clients > Cadastrar um atendente (Uso do admin)
routes.post("/attendants", auth(["Admin"]), AttendantController.create);
// PUT /clients/:id > Atualizar o cadastro de um atendente (Uso do admin)
routes.put("/attendants", auth(["Admin"]), AttendantController.update);
// DELETE /clients/:id > Deletar um atendente (Uso do admin)
routes.delete("/attendants/:id", auth(["Admin"]), AttendantController.delete);

/** rotas - controle de erro */
routes.use((req,res) => res.sendStatus(404));


// 500 - Internal Server Error
routes.use((err, req, res, next) => {
    console.log(err)
    return res.status(500).json({
        errror: true,
        message: "Internal Server Error"
    });
});

export default routes;