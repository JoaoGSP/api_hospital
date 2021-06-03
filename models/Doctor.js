import mongoose from 'mongoose';

import User from "./User.js";

export default User.discriminator('Doctor', new mongoose.Schema({
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
    select: false
  }
}));