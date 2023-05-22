const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user'); // Contrôleur pour les opérations sur les utilisateurs

// Routes pour l'inscription et la connexion des utilisateurs
router.post('/signup', userCtrl.signup); // Route pour l'inscription d'un nouvel utilisateur
router.post('/login', userCtrl.login); // Route pour la connexion d'un utilisateur existant

module.exports = router;
