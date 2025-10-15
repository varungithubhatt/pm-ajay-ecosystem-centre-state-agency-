const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StateUserSchema = new mongoose.Schema({
  stateName: { type: String, required: true },
  officialEmail: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  contactName: { type: String, required: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

StateUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

StateUserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('StateUser', StateUserSchema);
