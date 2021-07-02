import UserModel, { PacienteModel } from "../models/User.js";
import * as yup from 'yup'

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
        PacienteModel.findOne({_id: req.params.pid }, '_id cpf nome email createAt updateAt').then((client) => {
            return res.json({
                error: false,
                client
            });
        }).catch((err) => {
            console.log(err)
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
        //Validação dos campos
        const schema = yup.object().shape({
            nome: yup.string()
                .min(2, "Tamanho inválido"),
            sexo: yup.string()
            .oneOf(["masculino","feminino","outro"], "Opções: masculino|feminino|outro"),
            data_nasc: yup.date()
                .min(19100101)
                //.max()
                ,
            cpf: yup.string()
                .length(11, "O campo deve conter 11 digitos"),
            endereço: yup.object().shape({
                cep: yup.string()
                    .length(8, "O campo deve conter 8 digitos"),
                logradouro: yup.string(),
                numero: yup.string()
                    .max(5, "O campo não pode receber mais de 5 digitos"),
                complemento: yup.string()
                    .min(3, "Tamanho inválido"),
                cidade: yup.string()
                    .min(3, "Tamanho inválido"),
                estado: yup.string()
                    .min(2, "Tamanho inválido")
            }),
            telefone: yup.string()
                .length(11, "Tamanho inválido"),            
            email: yup.string()
                .email("Insira um email válido no formato: usuario@email.com")
        });
        try {
            await schema.validate(req.body);
        } catch(err) {
            return res.status(400).json({
                error: true,
                code: 120,
                message: err.message
            });
        }

        const emailExiste = await UserModel.findOne({ email: req.body.email });
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
        //Validação dos campos
        const schema = yup.object().shape({
            nome: yup.string()
                .min(2),
            sexo: yup.string()
                .oneOf(["masculino","feminino","outro"], "Opções: masculino|feminino|outro"),
            data_nasc: yup.date()
                .min(19100101)
                //.max()
                ,
            cpf: yup.string()
                .length(11),
            endereço: yup.object().shape({
                cep: yup.string()
                    .length(8),
                logradouro: yup.string(),
                numero: yup.string()
                    .length(5),
                complemento: yup.string()
                    .min(3),
                cidade: yup.string()
                    .min(3),
                estado: yup.string()
                    .min(2)
            }),
            telefone: yup.string()
                .length(11),            
            email: yup.string()
                .email()
        });
        try {
            await schema.validate(req.body);
        } catch(err) {
            return res.status(400).json({
                error: true,
                code: 120,
                message: err.message
            });
        }
        
        const clienteExiste = await PacienteModel.findOne({_id: req.params.pid});
        if(!clienteExiste){
            return res.status(400).json({
                error: true,
                code: 131,
                message: "Erro: Cliente não encontrado!"
            });
        };

        if(req.body.email == clienteExiste.email){
            const emailExiste = await UserModel.findOne({email: req.body.email});
            if(emailExiste){
                return res.status(400).json({
                    error: true,
                    code: 132,
                    message: "Erro: Este e-mail já está cadastrado!"
                });
            };
        };

        PacienteModel.updateOne({_id: req.params.pid}, req.body).then(() => {
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
        PacienteModel.deleteOne({ _id: req.params.pid }).then(() => {
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