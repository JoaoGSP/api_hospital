import { Router } from "express";
import ClientController from "./controllers/ClientController.js";
import DoctorController from "./controllers/DoctorController.js";
import AttendantController from "./controllers/AttendantController.js";

import bcrypt from 'bcrypt';

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

/* Bloco de controle de agentes do sistema */

//Cadastro e controle de clientes
// GET /clients > Listar clientes
routes.get("/clients", ClientController.list)
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
routes.get("/doctors", DoctorController.list)
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
routes.get("/attendants", AttendantController.list)
// GET /clients/:id > Listar um atendente
routes.get("/attendants/:id", AttendantController.listOne)
// POST /clients > Cadastrar um atendente
routes.post("/attendants", AttendantController.create)
// PUT /clients/:id > Atualizar o cadastro de um atendente
routes.put("/attendants", AttendantController.update)
// DELETE /clients/:id > Deletar um atendente
routes.delete("/attendants/:id", AttendantController.delete)

/* Bloco de funcionalidades do sistema */

//Cadastro e controle de consultas


export default routes;



/*

//Incluir o middleware authMiddleware nas rotas de produtos, para garantir que essas//
//operações sejam realizadas apenas a usuários autenticados.//

//Login//

*/