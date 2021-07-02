import UserModel, { MedicoModel } from '../models/User.js';
import bcrypt from 'bcrypt';
import * as yup from 'yup';

class DoctorController {
    // GET /doctors > Listar médicos
    // errors code: 100..109
    async list(req, res) {
        // consultar no banco os médicos
        MedicoModel.find({}).select("-senha").then((doctors) => {
            return res.json({
                error: false,
                doctors: doctors
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 100,
                message: "Erro: Não foi possível executar a solicitação!"
            });
        });
        }
    // GET /doctors/:did > Listar um médico
    // errors code: 110..119
    async listOne(req, res) {
        MedicoModel.findOne({ _id: req.params.did }, '_id nome email especialidade numCRM createAt updateAt').then((doctor) => {
            return res.json({
                error: false,
                doctor
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 110,
                message: "Erro: Não foi possível executar a solicitação!"
            })
        })
    }
    // POST /doctors > Cadastrar um médico
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
                .max(),
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
            numCRM: yup.string()
                .min(5),
            ecpecialidade: yup.string(),
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

        MedicoModel.create(req.body).then((doctor) => {
            return res.json(doctor);
        }).catch((err) => {
            console.log(err)
            return res.status(400).json({
                error: true,
                code: 120,
                message: "Error: Médico não foi cadastrado com sucesso"
            });
        });
    }
    // PUT /doctors/:id > Atualizar o cadastro de um médico
    // errors code: 130..139
    async update(req, res) {
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
                .email("Insira um email válido no formato: usuario@email.com"),
            numCRM: yup.string()
                .length(),
            ecpecialidade: yup.string(),
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

        const medicoExiste = await MedicoModel.findOne({_id: req.params.did});

        if(!medicoExiste){
            return res.status(400).json({
                error: true,
                code: 131,
                message: "Erro: Médico não encontrado!"
            });
        };

        if(req.body.email == medicoExiste.email){
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

        MedicoModel.updateOne({_id: req.params.did}, doctor).then(() => {
            return res.json({
                error: false,
                message: "Médico editado com sucesso!"
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 130,
                message: "Erro: O cadastro do médico não foi atualizado!"
            });
        });
    }
    // DELETE /doctors/:id > Deletar um médico
    // errors code: 140..149
    async delete(req, res) {
        MedicoModel.deleteOne({ _id: req.params.did }).then(() => {
            return res.json({
                error: false,
                message: "Médico apagado com sucesso!"
            });
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 140,
                message: "Error: Médico não foi apagado com sucesso!"
            });
        });
    }
}

export default new DoctorController();