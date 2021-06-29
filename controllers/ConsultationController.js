import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import Consulta from "../models/hospitalConsultation.js";
import {promisify} from "util";

class ConsultationController {
    // GET /consultas > Listar consultas
    async list(req, res) {
        let medico ;
        if(req.role === "Doctor"){
            medico = req.userID
        }
        Consulta.find({}).populate("paciente").populate({path: "medico", select: "-senha"}).then(consultas => {
            return res.status(200).json({
                error: false,
                consultas
            })
        })
        /*Consulta.find({}).then((consultas)=> { // sucesso
            res.json({ // status 200 ok
                error: false,
                consultas
            })
        })*/.catch((err) => {
            return res.status(400).json({
                error: true,
                code:100,
                message: "Erro: nao foi possivel executar solicitação"
            })
        });
    }//Metodo find OK
    // GET /consultas/:id > Listar uma consulta
    async listOne(req,res) {
        Consulta.findById({_id : req.params.cid}).then((consulta)=>{
            res.status(200).json({
                error: false,
                consulta
            })
        }).catch((err)=>{
                res.status(400).json({
                    error: true,
                    code: 101,
                    message: 'Não foi possivel executar a solicitação'
                })
            })
    }// FindOne OK
    //POST /consulta
    async create(req, res) {
        const schema = yup.object().shape({
            data_hora: yup.date(),
            categoria: yup.string()
                .oneOf(["Odontologia","Oftamologia"], "Escolha entre uma das opções: Odontologia|Oftamologia"),
            status: yup.string()
                .default('Disponivel')
                .oneOf(["Disponivel","Agendada","Confirmada","Atendida","Não Atendida"], "Status inválido. Opções: Disponivel|Agendada|Confirmada|Atendida|Não Atendida")
        })
        try {
            await schema.validate(req.body);
        } catch(err) {
            return res.status(400).json({
                error: true,
                code: 120,
                message: err.message
            });
        }

        req.body.medico = req.userID

        Consulta.create(req.body).then((consulta) => {
        return res.json(consulta)
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 102,
                message: 'Erro, consulta nao cadastrada'
            });
        })       
    }
    // PUT /consultas/:cid
    async update(req, res) {
        const schema = yup.object().shape({
            status: yup.string()
                .default('Disponivel')
                .oneOf(["Disponivel","Agendada","Confirmada","Atendida","Não Atendida"], "Status inválido. Opções: Disponivel|Agendada|Confirmada|Atendida|Não Atendida")
        })
        try {
            await schema.validate(req.body);
        } catch(err) {
            return res.status(400).json({
                error: true,
                code: 120,
                message: err.message
            });
        }
        Consulta.updateOne({ _id: req.params.cid }, req.body).then(() => {
            return res.json({
                error: false,
                message: 'Consulta editada com sucesso'
            })
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code: 133,
                message: 'A consulta não foi editada com sucesso'
            })
        })      
    }//Update OK
    // DELETE /consultas/:cid
    async delete(req, res) {
       Consulta.deleteOne({ _id: req.params.cid }).then(() => {
           return res.json({
               error: false,
               message: 'Apagado com sucesso'
           })
       }).catch((err) => {
           console.log(err);
           return res.status(400).json({
               error: true,
               code: 134,
               message: ' Não foi deletado com sucesso'
           })
       })      
    }
}//Delete ok

export default new ConsultationController();