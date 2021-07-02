import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from "../models/User.js";

class LoginController {
   /* code 150 .. 159 */
    async login(req, res) {
        const { email, senha } = req.body;

        const userExiste = await User.findOne({email: email});

        if(!userExiste) {
            return res.status(401).json({
                error: true,
                code: 150,
                message: "Erro: Usuário não encontrado!"
            });
        }

        if( !bcrypt.compareSync(senha, userExiste.senha) ) {
            return res.status(401).json({
                error: true,
                code: 151,
                message: "Erro: Senha inválida!"
            });
        }

        return res.json({
            user: {
                _id: userExiste._id,
                nome: userExiste.nome,
                email
            },
            token: jwt.sign({id: userExiste._id, role: userExiste._role},
                process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
        });

    }

}

export default new LoginController();