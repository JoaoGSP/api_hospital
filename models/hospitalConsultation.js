import mongoose from 'mongoose';
//import Client from './Client.js';
//import Doctor from './Doctor.js';

//import User from "./User.js";

const ConsultationSchema = new mongoose.Schema({
    paciente: {type: mongoose.Schema.Types.ObjectId, ref: "Client"},
    medico: {type: mongoose.Schema.Types.ObjectId, ref: "Doctor"},
    data_hora: Date,
    categoria: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    }
});

export default mongoose.model ('Consultation', ConsultationSchema)