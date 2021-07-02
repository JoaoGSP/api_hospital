import UserModel, { AtendenteModel } from "../models/User.js";
import bcrypt from 'bcrypt';
import * as yup from 'yup';


class AttendantController {
    // GET /attendants > Listar atendentes
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
        //Garantir que não seja inserida uma data de nascimento inválida
        const today = new Date();
        today.setHours(0, 0, 0, 0)
        //Validação dos campos
        const schema = yup.object().shape({
            nome: yup.string()
                .min(2, "Tamanho inválido"),
            sexo: yup.string()
                .oneOf(["masculino","feminino","outro"], "Opções: masculino|feminino|outro"),
            data_nasc: yup.date()
                .min(19100101)
                .max(today),
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
                .email("Insira um email válido no formato: usuario@email.com"),
            senha: yup.string()
                .matches(/^[0-9]+$/, "A senha deve conter apenas valores numéricos")
                .length(6, "A senha deve ter exatamente 6 dígitos")
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
    async update(req, res) {
        //Validação dos campos
        const schema = yup.object().shape({
            nome: yup.string()
                .min(2, "Tamanho inválido"),
            sexo: yup.string()
            .oneOf(["masculino","feminino","outro"], "Opções: masculino|feminino|outro"),
            data_nasc: yup.date()
                .min(19100101)
                .max(today),
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
                .email("Insira um email válido no formato: usuario@email.com"),
            senha: yup.string()
                .matches(/^[0-9]+$/, "A senha deve conter apenas valores numéricos")
                .length(6, "A senha deve ter exatamente 6 dígitos")
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

        const atendenteExiste = await AtendenteModel.findOne({_id: req.params.id});

        if(!atendenteExiste){
            return res.status(400).json({
                error: true,
                code: 131,
                message: "Erro: Atendente não encontrado!"
            });
        };

        if(req.body.email == atendenteExiste.email){
            const emailExiste = await UserModel.findOne({email: req.body.email});
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