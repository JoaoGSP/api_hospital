//const mongoose = require('mongoose');
import mongoose from 'mongoose';
//const mongoosePaginate = require('mongoose-paginate-v2')
import mongoosePaginate from 'mongoose-paginate-v2';
import { string } from 'yup';

const Client = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  sexo: {
    type: String,
    required: true
  },
  idade: {
    type: Number,
    required: true
  },
  cpf: {
    type: String,
    required: true
  },  
  endereço: {
    type: String,
    reguired: true
  },
  telefone: {
    type: Number,
    required: true
  },
  email:{
    type: String
  },
  numCartaoSUS: {
    type: Number,
    required: true
  },
  senha: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
});

Client.plugin(mongoosePaginate);

//module.exports = mongoose.model('client',Client);
export default mongoose.model('client', Client);