import bcrypt from 'bcrypt';
import Consultation from '../models/hospitalConsultation.js';
import UserModel from "../models/User.js";

class ProfileController {
    async list(req, res) {
        UserModel.findById(req.userID)
            .then(user => res.json({ user }))
            .catch(() => res.status(404).json({error: true, message: "Usuário não encontrado!"}))
    }

    async update(req, res) {
        try { 
            //Verficar se o email a ser atualizado já está ou não cadastrado
            if (req.body.email) {
                const emailExiste = await UserModel.findOne({ email: req.body.email });
                if (!emailExiste)
                    return res.status(400).json({error: true, message: "Email já cadastrado!"})
            }
            //Verificação se o usuário logado está fazendo alterações em campos que são permitidos
            if((req.body.numCRM || req.body.especialidade) && req.role !== 'Doctor'){
                return res.status(403).json({error: true, message: "Usuário não autorizado a executar a solicitação"})
            }

            if (req.body.senha)
                req.body.senha = bcrypt.hashSync(req.body.senha, 7);
    
            await UserModel.updateOne({ _id: req.userID }, req.body, { runValidators: true });
            return res.json({ error: false, message: "Usuário atualizado com sucesso!" });
        } catch(err) {
                if (err.name === "ValidationError") {
                    return res.status(400).json({
                        error: true,
                        message: err.message,
                        ValidationError: err.errors
                    });
                }

                return res.status(400).json({
                    error: true,
                    message: "Erro ao executar a solitação!"
                });
        };
    }

    async delete(req, res) {
        UserModel.deleteOne({ _id: req.userID })
            .then(() => res.json({ error: false, message: 'Usuário deletado com sucesso!' }))
            .catch(() => res.status(404).json({
                error: true,
                message: "Usuário não encontrado!"
            }))
    }

    async listConsultas(req, res) {
        try{
        const consultas = await Consultation.find({medico: req.userID}).populate({path: 'medico', select: '-senha'})
                res.json({ consultas })
        } catch (err){
                res.status(400).json({
                    erro: true,
                    message: "Erro ao executar a solicitação!"
            })
        }
    }
}

export default new ProfileController();