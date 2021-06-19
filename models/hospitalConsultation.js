import mongoose from 'mongoose';
//import Client from './Client.js';
//import Doctor from './Doctor.js';

import User from "./User.js";

export default User.discriminator('HospitalConsultation', new mongoose.Schema({
    paciente: {
        nome: {
            type: String,
            required: false
          },
          sexo: {
            type: String,
            required: false
          },
          data_nasc: {
            type: Number,
            required: false
          },
          cpf: {
            type: String,
            required: false
          },
    },
    medico: {
        nome: {
            type: String,
            required: false
          },
          sexo: {
            type: String,
            required: false
          },
          data_nasc: {
            type: Number,
            required: false
          },
          cpf: {
            type: String,
            required: false
          },
          especialidade: {
            type: String,
            required: false
        },
    },
    categoria: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    }
}));