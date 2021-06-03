import mongoose from 'mongoose';

import User from "./User.js";

export default User.discriminator('Client', new mongoose.Schema({}));
