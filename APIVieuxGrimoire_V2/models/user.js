const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma de l'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Plugin uniqueValidator pour valider l'unicité de l'email
userSchema.plugin(uniqueValidator);

// Exporte le modèle d'utilisateur créé à partir du schéma
module.exports = mongoose.model('User', userSchema);

