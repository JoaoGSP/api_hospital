import Client from "../models/client.js";

class ClientController {
    // GET /clients > Listar clientes
    // errors code: 100..109
    async list(req, res) {
        // consultar no banco os clientes
        Client.find({}).select("-senha").then((clients) => {
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
        Client.findOne({ _id: req.params.id }, '_id nome email createAt updateAt').then((client) => {
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
        Client.create(req.body).then((client) => {
            return res.json(client);
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 120,
                message: "Error: Cliente não foi cadastrado com sucesso"
            });
        });
    }
    // PUT /clients/:id > Atualizar o cadastro de um cliente
    // errors code: 130..139
    async update(req, res) {
        const client = req.body;
        Client.updateOne({_id: req.params.id}, client).then(() => {
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
        Client.deleteOne({ _id: req.params.id }).then(() => {
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