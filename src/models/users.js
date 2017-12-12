const mongoose = require('mongoose');
const slugHero = require('mongoose-slug-hero');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

slugHero.config.counter = 'slug_counters';

const userSchema = new Schema(({
  slug: {
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
  password: {
    type: String,
    required: true,
    select: false,
  },
  birthday: {
    type: Date,
    default: null,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Date,
    default: null,
  },
}
/*
{
  strict: false,
}*/
));

userSchema.plugin(slugHero, { doc: 'slugs', field: 'name' });

// userSchema.methods.comparePassWord = password =>
// bcrypt.compareSync(password, this.hash_password);
userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
