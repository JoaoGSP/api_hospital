import { Router } from "express";

//import bcrypt from "bcrypt"
//import mongoose from "mongoose";
import ClientController from "./controllers/ClientController.js";
import DoctorController from "./controllers/DoctorController.js";
import AttendantController from "./controllers/AttendantController.js";
import LoginController from "./controllers/LoginController.js";
import ConsultationController from "./controllers/ConsultationController.js";

import UserModel from "./models/User.js";
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
routes.post("/login", LoginController.login)

//Listar todos os úsuarios cadastrados no sistema (Uso do Admin)
routes.get("/users", auth(["Admin"]), async (req, res) => {
    
    const {_id, _role, nome, sexo, data_nasc, cpf} = req.query;

    UserModel.find(JSON.parse(JSON.stringify({_id, _role, nome, sexo, data_nasc, cpf}))).then((users)=>{
        res.json({users})
    });
})

routes.get("/users/:id", async (req, res)=>{
    try{
        const user = await UserModel.findById(req.params.id)
        user.set(req.body)
        await user.save()

        await UserModel.updateOne({_id: req.params.id}, req.body, {runValidators: true})
        res.status(200).json({erro:false, message:"Usuário atualizado!"})
    }catch(err){
        if (err.name === "ValidationError") {
            return res.status(400).json({
                error: true,
                message: err.message,
                ValidationError: err.errors
            });
        }

        return res.status(400).json({
            error: true,
            message: "Erro ao executar a solitação!"
        });
    }
})

//Listar todas as consultas
routes.get("/consultas", auth(["Admin", "Attendant"]), ConsultationController.list);
//listar uma consulta
routes.get("/consultas/:cid", auth(["Admin", "Attendant"]), ConsultationController.listOne)
//Criação de consultas pelo médico
routes.post("/consultas", auth(["Doctor"]), ConsultationController.create)
//Edição de consultas pelo atendente
routes.put("/consultas/:cid", auth(["Attendant", "Doctor"]),ConsultationController.update)
//Deleção de consultas (Uso do admin)
routes.delete("/consultas/:cid", auth(["Admin"]), ConsultationController.delete)


/* Bloco de controle de agentes do sistema */

//Cadastro e controle de clientes
// GET /clients > Listar clientes
routes.get("/clients", auth(["Admin", "Attendant"]), ClientController.list)
// GET /clients/:id > Listar um cliente
routes.get("/clients/:pid", auth(["Admin", "Attendant"]), ClientController.listOne)
// POST /clients > Cadastrar um cliente
routes.post("/clients", auth(["Admin", "Attendant"]), ClientController.create)
// PUT /clients/:id > Atualizar o cadastro de um cliente
routes.put("/clients/:pid", auth(["Admin", "Attendant"]), ClientController.update)
// DELETE /clients/:id > Deletar um cliente
routes.delete("/clients/:pid", auth(["Admin", "Attendant"]), ClientController.delete)

//Cadastro e controle de médicos
// GET /doctors > Listar médicos
routes.get("/doctors", auth(["Admin", "Attendant"]), DoctorController.list)
// GET /doctors/:id > Listar um médico
routes.get("/doctors/:did", auth(["Admin", "Attendant"]), DoctorController.listOne)
// POST /doctors > Cadastrar um médico (Uso do admin)
routes.post("/doctors", auth(["Admin"]), DoctorController.create)
// PUT /doctors/:id > Atualizar o cadastro de um médico (Uso do admin)
routes.put("/doctors/:did", auth(["Admin"]),DoctorController.update)
// DELETE /doctors/:id > Deletar um médico (Uso do admin)
routes.delete("/doctors/:did", auth(["Admin"]), DoctorController.delete)

//Cadastro e controle de atendentes
// GET /attendants > Listar atendentes (Uso do admin)
routes.get("/attendants", auth(["Admin"]), AttendantController.list)
// GET /clients/:id > Listar um atendente (Uso do admin)
routes.get("/attendants/:id", auth(["Admin"]), AttendantController.listOne)
// POST /clients > Cadastrar um atendente (Uso do admin)
routes.post("/attendants", auth(["Admin"]), AttendantController.create)
// PUT /clients/:id > Atualizar o cadastro de um atendente (Uso do admin)
routes.put("/attendants", auth(["Admin"]), AttendantController.update)
// DELETE /clients/:id > Deletar um atendente (Uso do admin)
routes.delete("/attendants/:id", auth(["Admin"]), AttendantController.delete)

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