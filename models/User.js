import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
  endereço: {
    cep: {
        type: String,
        required: false
    },
    logradouro: {
        type: String,
        required: false
    },
    numero: {
        type: String,
        required: false
    },
    complemento: String,
    cidade: {
        type: String,
        required: false
    },
    estado: {
        type: String,
        required: false
    }
  },
  telefone: {
    type: Number,
    required: false
  },
  email:{
    type: String
  }
}, {
    timestamps: true,
    discriminatorKey: '_role'
});

const UserModel = mongoose.model('User', UserSchema);

UserModel.discriminator('Admin', new mongoose.Schema({ senha: String }));

export const MedicoModel = UserModel.discriminator('Doctor', new mongoose.Schema({
  numCRM: {
    type: Number,
    required: false
  },
  especialidade: {
      type: String,
      required: false
  },
  senha: {
    type: String,
    required: true,
  }
}));

export const AtendenteModel = UserModel.discriminator('Attendant', new mongoose.Schema({
  senha: {
    type: String,
    required: true,
  }
}));

export const PacienteModel = UserModel.discriminator('Client', new mongoose.Schema({}));

export default UserModel;