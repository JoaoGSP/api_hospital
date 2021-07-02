import jwt from 'jsonwebtoken';
import {promisify} from "util";

export default (arrayOfAuthUsers) => {
    return async(req, res, next) => {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                error: true,
                code: 160,
                message: "Erro: Token não encontrado!"
            });
        }

        const [, token] = authHeader.split(" ");

        try {
            const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            req.userID = decode.id;
            req.role = decode.role
            
            if(arrayOfAuthUsers.indexOf(req.role) === -1) {
                return res.status(401).json({
                    error: true,
                    message: "Usuário não autorizado!"
                });
            }

            return next();
        } catch(err) {
            return res.status(401).json({
                error: true,
                code: 161,
                message: "Erro: Token inválido!"
            });
        }

    }
}
