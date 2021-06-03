import mongoose from 'mongoose';

import User from './User.js';

export default User.discriminator('Attendant', new mongoose.Schema({
  senha: {
    type: String,
    required: true
  }
}));