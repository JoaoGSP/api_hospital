import * as yup from 'yup';
import Consulta from "../models/hospitalConsultation.js";

class ConsultationController {
    // GET /consultas > Listar consultas
    async list(req, res) {
        await Consulta.find({}).then(consultas => {
                return res.status(200).json({ error: false, consultas })
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                code:100,
                message: "Erro: nao foi possivel executar solicitação"
            })
        });
    }
    // GET /consultas/:id > Listar uma consulta
    async listOne(req,res) {
        await Consulta.findById({_id : req.params.cid}).then((consulta)=>{
                
                if(consulta.medico != req.userID){ //Garantir que o médico só consiga acessar as suas próprias consultas
                    if(req.role !== 'Attendant'){
                        return res.status(403).json({error: true, message: "Usuário não autorizado a executar a solicitação!"})
                    }
                }

                return res.status(200).json({error: false, consulta})
        }).catch((err)=>{
            console.log(err)
                res.status(400).json({
                    error: true,
                    code: 101,
                    message: 'Não foi possivel executar a solicitação'
                })
            })
    }
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
        return res.status(400).json({error: false, consulta})
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
    }
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
}

export default new ConsultationController();