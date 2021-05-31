//const { Router } = require("express");
import { Router } from "express";
import ClientController from "../controllers/ClientController.js";
import DoctorController from "../controllers/DoctorController.js";
import AttendantController from "../controllers/AttendantController.js";

const routes = new Router();

// rotas
routes.get("/", async (req, res) => {
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

//module.exports = routes;
export default routes;



/*

//Incluir o middleware authMiddleware nas rotas de produtos, para garantir que essas//
//operações sejam realizadas apenas a usuários autenticados.//


// GET /products > Listar produtos
// /products?page=1&limit=10
routes.get("/products", ProductController.list);
// GET /products/:id > Listar um produto
routes.get("/products/:id", ProductController.listOne);
// POST /products > Criar um produto
routes.post("/products", ProductController.create);
// PUT /products/:id > Atualizar um produto
routes.put("/products/:id", ProductController.update);
// DELETE /products/:id > Deletar um produto
routes.delete("/products/:id", ProductController.delete); 

//Login//
//Criar a rota de login com o método post.

//User//
routes.post("/users", UserController.create);

//Se a autenticação estiver funcionando adequadamente, pode utilizar essas rotas como teste.//


// Me (usuário autenticado)//
routes.get("/me", authMiddleware, UserController.listMe);
routes.put("/me", authMiddleware, UserController.updateMe);
routes.delete("/me", authMiddleware, UserController.deleteMe);
*/