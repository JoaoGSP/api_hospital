import mongoose from 'mongoose';

import User from "./User.js";

export default User.discriminator('Doctor', new mongoose.Schema({
  numCRM: {
    type: Number,
    required: true
  },
  especialidade: {
      type: String,
      required: true
  },
  senha: {
    type: String,
    required: true
  }
}));