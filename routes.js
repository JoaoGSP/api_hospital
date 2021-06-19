import { Router } from "express";

import ClientController from "./controllers/ClientController.js";
import DoctorController from "./controllers/DoctorController.js";
import AttendantController from "./controllers/AttendantController.js";
import LoginController from "./controllers/LoginController.js";
import ConsultationController from "./controllers/ConsultationController.js";
import auth from "./middleware/auth.js";

const routes = new Router();

// rotas
routes.get("/", async (req, res) => {
/*
import User from "./models/User.js";
import mongoose from 'mongoose';
await User.discriminator('Admin', new mongoose.Schema({ senha: String })).create({
    email: "admin@sistema.com",
    senha: bcrypt.hashSync("12345678", 7)
});
*/  
  res.send("Bem vindo ao Sistema!");
});


routes.post("/login", LoginController.login)


/* Bloco de controle de agentes do sistema */

//Cadastro e controle de clientes
// GET /clients > Listar clientes
routes.get("/clients", auth(["Admin", "Attendant"]), ClientController.list)
// GET /clients/:id > Listar um cliente
routes.get("/clients/:id", auth(["Admin", "Attendant"]), ClientController.listOne)
// POST /clients > Cadastrar um cliente
routes.post("/clients", auth(["Admin", "Attendant"]), ClientController.create)
// PUT /clients/:id > Atualizar o cadastro de um cliente
routes.put("/clients", auth(["Admin", "Attendant"]), ClientController.update)
// DELETE /clients/:id > Deletar um cliente
routes.delete("/clients/:id", auth(["Admin", "Attendant"]), ClientController.delete)

//Cadastro e controle de médicos
// GET /doctors > Listar médicos
routes.get("/doctors", auth(["Admin", "Attendant"]), DoctorController.list)
// GET /doctors/:id > Listar um médico
routes.get("/doctors/:id", auth(["Admin", "Attendant"]), DoctorController.listOne)
// POST /doctors > Cadastrar um médico
routes.post("/doctors", auth(["Admin"]), DoctorController.create)
// PUT /doctors/:id > Atualizar o cadastro de um médico
routes.put("/doctors", auth(["Admin"]),DoctorController.update)
// DELETE /doctors/:id > Deletar um médico
routes.delete("/doctors/:id", auth(["Admin"]), DoctorController.delete)

//Cadastro e controle de atendentes
// GET /attendants > Listar atendentes
routes.get("/attendants", auth(["Admin"]), AttendantController.list)
// GET /clients/:id > Listar um atendente
routes.get("/attendants/:id", auth(["Admin"]), AttendantController.listOne)
// POST /clients > Cadastrar um atendente
routes.post("/attendants", auth(["Admin"]), AttendantController.create)
// PUT /clients/:id > Atualizar o cadastro de um atendente
routes.put("/attendants", auth(["Admin"]), AttendantController.update)
// DELETE /clients/:id > Deletar um atendente
routes.delete("/attendants/:id", auth(["Admin"]), AttendantController.delete)

// rotas do perfil do usuário logado
//req.userID
//GET /profile
/* Bloco de funcionalidades do sistema */

//Cadastro e controle de consultas
//GET /consultas > Listas consultas
routes.get("/consultas", auth(["Admin", "Attendant", "Doctor"]), ConsultationController.list)
//GET /consultas/:id > Listar uma consulta
routes.get("/consultas/:id", auth(["Admin", "Attendant", "Doctor"]), ConsultationController.listOne)
//POST /consultas > Criar uma consulta
routes.post("/consultas", auth(["Admin", "Attendant", "Doctor"]), ConsultationController.create)
//PUT /consultas/:id > Editar uma consulta
routes.put("/consultas/:id", auth(["Admin", "Attendant", "Doctor"]), ConsultationController.update)
//DELETE /consultas/:id > Deletar uma consulta
routes.delete("/consultas/:id", auth(["Admin", "Attendant", "Doctor"]), ConsultationController.delete)

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