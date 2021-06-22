import { AtendenteModel } from "../models/User.js";
import bcrypt from 'bcrypt';

class AttendantController {
    // GET /attendants > Listar atendentes
    // errors code: 100..109
    async list(req, res) {
        // consultar no banco os clientes
        AtendenteModel.find({}).select("-senha").then((attendants) => {
            return res.json({
                error: false,
                attendants: attendants
            });
        }).catch((error) => {
            return res.status(400).json({
                error: true,
                code: 100,
                message: "Erro: Não foi possível executar a solicitação!"
            });
        });
    }
    // GET /attendants/:id > Listar um atendente
    // errors code: 110..119
    async listOne(req, res) {
        AtendenteModel.findOne({ _id: req.params.id }, '_id nome email createAt updateAt').then((attendant) => {
            return res.json({
                error: false,
                attendant: attendant
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 110,
                message: "Erro: Não foi possível executar a solicitação!"
            })
        })
    }
    // POST /attendants > Cadastrar um atedente
    // errors code: 120..129
    async create(req, res) {
        const emailExiste = await AtendenteModel.findOne({ email: req.body.email });
        if (emailExiste) {
            return res.status(400).json({
                error: true,
                code: 121,
                message: "Error: Este e-mail já está cadastrado!"
            });
        };

        req.body.senha = await bcrypt.hash(req.body.senha, 7);

        AtendenteModel.create(req.body).then((attendant) => {
            return res.json(attendant);
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 120,
                message: "Error: Atendente não foi cadastrado com sucesso"
            });
        });
    }
    // PUT /attendants/:id > Atualizar o cadastro de um atendente
    // errors code: 130..139
    async update(req, res) {
        const atendenteExiste = await AtendenteModel.findOne({_id: req.params.id});

        if(!atendenteExiste){
            return res.status(400).json({
                error: true,
                code: 131,
                message: "Erro: Atendente não encontrado!"
            });
        };

        if(req.body.email !== atendenteExiste.email){
            const emailExiste = await Client.findOne({email: req.body.email});
            if(emailExiste){
                return res.status(400).json({
                    error: true,
                    code: 132,
                    message: "Erro: Este e-mail já está cadastrado!"
                });
            };
        };

        if(req.body.senha !== undefined) {
            req.body.senha = await bcrypt.hash(req.body.senha, 7);
        }

        AtendenteModel.updateOne({_id: req.params.id}, attendant).then(() => {
            return res.json({
                error: false,
                message: "Atendente editado com sucesso!"
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 130,
                message: "Erro: O cadastro do atendente não foi atualizado!"
            });
        });
    }
    // DELETE /attendants/:id > Deletar um atendente
    // errors code: 140..149
    async delete(req, res) {
        AtendenteModel.deleteOne({ _id: req.params.id }).then(() => {
            return res.json({
                error: false,
                message: "Atendete apagado com sucesso!"
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 140,
                message: "Error: Atendente não foi apagado com sucesso!"
            });
        });
    }
}

export default new AttendantController();