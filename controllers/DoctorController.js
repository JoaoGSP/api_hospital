//const Doctor = require("../models/Doctor");
import Doctor from "../models/doctor.js";

class DoctorController {
    // GET /doctors > Listar médicos
    // errors code: 100..109
    async list(req, res) {
        // consultar no banco os médicos
        Doctor.find({}).select("-senha").then((doctors) => {
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
        Doctor.findOne({ _id: req.params.id }, '_id nome email createAt updateAt').then((doctor) => {
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
        Doctor.create(req.body).then((doctor) => {
            return res.json(doctor);
        }).catch((err) => {
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
        const doctor = req.body;
        Doctor.updateOne({_id: req.params.id}, doctor).then(() => {
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
        Doctor.deleteOne({ _id: req.params.id }).then(() => {
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