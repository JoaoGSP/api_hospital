//const mongoose = require('mongoose');
import mongoose from 'mongoose';
//const mongoosePaginate = require('mongoose-paginate-v2')
import mongoosePaginate from 'mongoose-paginate-v2';

const Doctor = new mongoose.Schema({
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
    type: Object,
    reguired: true
  },
  telefone: {
    type: Number,
    required: true
  },
  email:{
    type: String
  },
  numCRM: {
    type: Number,
    required: true
  },
  especialidade: {
      type: String,
      required: true
  },
  setor: {
      type: String,
      required: true
  },
  senha: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
});

Doctor.plugin(mongoosePaginate);

//module.exports = mongoose.model('doctor',Doctor);
export default mongoose.model('doctor', Doctor);