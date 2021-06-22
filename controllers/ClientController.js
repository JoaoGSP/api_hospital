import { PacienteModel } from "../models/User.js";

class ClientController {
    // GET /clients > Listar clientes
    // errors code: 100..109
    async list(req, res) {
        // consultar no banco os clientes
        PacienteModel.find({}).select("-senha").then((clients) => {
            return res.json({
                error: false,
                clients: clients
            });
        }).catch((error) => {
            return res.status(400).json({
                error: true,
                code: 100,
                message: "Erro: Não foi possível executar a solicitação!"
            });
        });
        }
    // GET /clients/:id > Listar um cliente
    // errors code: 110..119
    async listOne(req, res) {
        PacienteModel.findOne({ _id: req.params.id }, '_id nome email createAt updateAt').then((client) => {
            return res.json({
                error: false,
                client: client
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 110,
                message: "Erro: Não foi possível executar a solicitação!"
            })
        })
    }
    // POST /clients > Cadastrar um cliente
    // errors code: 120..129
    async create(req, res) {
        const emailExiste = await PacienteModel.findOne({ email: req.body.email });
        if (emailExiste) {
            return res.status(400).json({
                error: true,
                code: 121,
                message: "Error: Este e-mail já está cadastrado!"
            });
        };

        PacienteModel.create(req.body).then((client) => {
            return res.json(client);
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 120,
                message: "Error: Usuário não cadastrado!"
            });
        });
    }
    // PUT /clients/:id > Atualizar o cadastro de um cliente
    // errors code: 130..139
    async update(req, res) {
        
        const clienteExiste = await PacienteModel.findOne({_id: req.params.id});

        if(!clienteExiste){
            return res.status(400).json({
                error: true,
                code: 131,
                message: "Erro: Cliente não encontrado!"
            });
        };

        if(req.body.email !== clienteExiste.email){
            const emailExiste = await PacienteModel.findOne({email: req.body.email});
            if(emailExiste){
                return res.status(400).json({
                    error: true,
                    code: 132,
                    message: "Erro: Este e-mail já está cadastrado!"
                });
            };
        };

        PacienteModel.updateOne({_id: req.params.id}, client).then(() => {
            return res.json({
                error: false,
                message: "Cliente editado com sucesso!"
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 130,
                message: "Erro: O cadastro do cliente não foi atualizado!"
            });
        });
    }
    // DELETE /clients/:id > Deletar um cliente
    // errors code: 140..149
    async delete(req, res) {
        PacienteModel.deleteOne({ _id: req.params.id }).then(() => {
            return res.json({
                error: false,
                message: "Cliente apagado com sucesso!"
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 140,
                message: "Error: Cliente não foi apagado com sucesso!"
            });
        });
    }
}

export default new ClientController();