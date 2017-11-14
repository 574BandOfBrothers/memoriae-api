const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema(({
  id: {
    type: String,
    index: true,
    unique: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  hash_password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}
/*
{
  strict: false,
}*/
));

userSchema.methods.comparePassWord = password => bcrypt.compareSync(password, this.hash_password);

module.exports = mongoose.model('users', userSchema);
