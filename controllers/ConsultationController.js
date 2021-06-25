import * as Yup from 'yup';
import mongoose from 'mongoose';

import Consulta from "../models/hospitalConsultation.js"

class ConsultationController {
    // GET /consultas > Listar consultas
    async list(req, res) {
        Consulta.find({}).select({}).then((consulta) => {
            return res.status(200).json({
                error: false,
                consulta
            /*routes.get("/consultas", async(req, res) =>{
                Consulta.find().populate("paciente").populate({path: "medico", select: "-senha"}).then(consultas => {
                    return res.json({
                        consultas
                    })
                })
            })*/
            })
            //message: "TODO - Listar consultas"
            }) .catch((err) => {
                return res.status(400).json({
                    error: true,
                    code:100,
                    message: "Erro: nao foi possivel executar solicitação"
                })
            });
    }
    // GET /consultas/:id > Listar uma consulta
    async listOne(req, res) {

        Consulta.findOne({ id: req.params.id},
             '_id nome idade categoria create At updateAt').then((consulta) => {
                 return res.json({
                     error: false,
                     consulta
                 }).catch((err) =>{
                     return res.status(400).json({
                         error: true,
                         code: 101,
                         message: 'Nao foi possivel encontrar consulta'

                     })
                     })
             })
        
        
    }
    //POST /consulta
    async create(req, res) {
        req.body.medico = mongoose.Types.ObjectId(req.body.medico) 
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
    // PUT /consultas/:id
    async update(req, res) {

        /*const schema = Yup.object().shape({
            nome: Yup.string()
            .notOneOf(['']),
            idade: Yup.string()
            .notOneOf(),
            categoria: Yup.string()
            .notOneOf()
        })*/

        const consultaExiste = await Consulta.findOne({ _id: req.params.id }).then(() => {
            if(!consultaExiste) {
                return res.status(400).json({

                })
            }
        })
       Consulta.updateOne({ _id: req.params.id }, req.body).then(() => {
           return res.json({
               error: false,
               message: 'Consulta editada com sucesso'
           })
       }).catch((err) => {
           return res.status(400).json({
               error: true,
               code: 133,
               message: 'Erro, consulta nao foi editada com sucesso'
           })
       })      
    }
    // DELETE /consultas/:id
    async delete(req, res) {
       Consulta.deleteOne({ _id: req.params.id }).then(() => {
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
}

export default new ConsultationController();


/*
routes.put("/consultas/:id", async (req, res) =>{
    Consulta.updateOne({_id: req.params.id}, req.body).then(()=>{
        return res.json({
            erro: false,
            message: "Consulta atualizada com sucesso!"
        })
    })
})
*/