import mongoose from 'mongoose';

const DB_PASS= process.env.DB_PASS;
const DB_HOST= process.env.DB_HOST;
const DB_USER= process.env.DB_USER;
const DB_NAME= process.env.DB_NAME;

class Connection {
  constructor() {
    this.mongodb();
  }
  mongodb() {
    mongoose.connect(//(DB_HOST) ? remoto : local
        (DB_HOST) ? `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority` 
        : "mongodb://localhost/adsbackend", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log("Conexão com o banco de dados realizada com sucesso!");
    }).catch((exception) => {
      console.log("Erro: Conexão com banco de dados não foi realizada com sucesso" + exception);
    });
  }
}

export default new Connection();