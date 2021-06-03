import { Router } from "express";

import ClientController from "./controllers/ClientController.js";
import DoctorController from "./controllers/DoctorController.js";
import AttendantController from "./controllers/AttendantController.js";
import LoginController from "./controllers/LoginController.js";
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


/*

//Incluir o middleware authMiddleware nas rotas de produtos, para garantir que essas//
//operações sejam realizadas apenas a usuários autenticados.//

//Login//

*/

routes.post("/login", LoginController.login)


/* Bloco de controle de agentes do sistema */

//Cadastro e controle de clientes
// GET /clients > Listar clientes
routes.get("/clients", auth(["Admin", "Attendant"]), ClientController.list)
// GET /clients/:id > Listar um cliente
routes.get("/clients/:id", ClientController.listOne)
// POST /clients > Cadastrar um cliente
routes.post("/clients", ClientController.create)
// PUT /clients/:id > Atualizar o cadastro de um cliente
routes.put("/clients", ClientController.update)
// DELETE /clients/:id > Deletar um cliente
routes.delete("/clients/:id", ClientController.delete)

//Cadastro e controle de médicos
// GET /doctors > Listar médicos
routes.get("/doctors", auth(["Admin", "Attendant"]), DoctorController.list)
// GET /doctors/:id > Listar um médico
routes.get("/doctors/:id", DoctorController.listOne)
// POST /doctors > Cadastrar um médico
routes.post("/doctors", DoctorController.create)
// PUT /doctors/:id > Atualizar o cadastro de um médico
routes.put("/doctors", DoctorController.update)
// DELETE /doctors/:id > Deletar um médico
routes.delete("/doctors/:id", DoctorController.delete)

//Cadastro e controle de atendentes
// GET /attendants > Listar atendentes
routes.get("/attendants", auth(["Admin"]), AttendantController.list)
// GET /clients/:id > Listar um atendente
routes.get("/attendants/:id", AttendantController.listOne)
// POST /clients > Cadastrar um atendente
routes.post("/attendants", AttendantController.create)
// PUT /clients/:id > Atualizar o cadastro de um atendente
routes.put("/attendants", AttendantController.update)
// DELETE /clients/:id > Deletar um atendente
routes.delete("/attendants/:id", AttendantController.delete)

// rotas do perfil do usuário logado
req.userID
GET /profile
/* Bloco de funcionalidades do sistema */

//Cadastro e controle de consultas

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