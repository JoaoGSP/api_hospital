import bcrypt from 'bcrypt';
import { MedicoModel } from '../models/User.js';

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
        }).catch((error) => {
            return res.status(400).json({
                error: true,
                code: 100,
                message: "Erro: Não foi possível executar a solicitação!"
            });
        });
        }
    // GET /doctors/:id > Listar um médico
    // errors code: 110..119
    async listOne(req, res) {
        MedicoModel.findOne({ _id: req.params.id }, '_id nome email createAt updateAt').then((doctor) => {
            return res.json({
                error: false,
                doctor: doctor
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
        const emailExiste = await MedicoModel.findOne({ email: req.body.email });
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
        const medicoExiste = await MedicoModel.findOne({_id: req.params.id});

        if(!medicoExiste){
            return res.status(400).json({
                error: true,
                code: 131,
                message: "Erro: Médico não encontrado!"
            });
        };

        if(req.body.email !== medicoExiste.email){
            const emailExiste = await MedicoModel.findOne({email: req.body.email});
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

        MedicoModel.updateOne({_id: req.params.id}, doctor).then(() => {
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
        MedicoModel.deleteOne({ _id: req.params.id }).then(() => {
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

//module.exports = new DoctorController();
export default new DoctorController();