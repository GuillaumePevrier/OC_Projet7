const express = require('express');
const router = express.Router();

// Importation des middlewares et des contrôleurs
const auth = require('../middleware/auth'); // Middleware d'authentification
const multerConfig = require('../middleware/multer-config'); // Configuration de Multer pour la gestion des fichiers

const bookCtrl = require('../controllers/book'); // Contrôleur pour les opérations sur les livres

// Routes pour les différentes fonctionnalités du livre
router.get('/', bookCtrl.getAllBooks); // Récupère tous les livres
router.post('/', auth, multerConfig.upload, multerConfig.convertToWebp, bookCtrl.createBook); // Crée un nouveau livre
router.get('/:id', bookCtrl.getBook); // Récupère un livre par son identifiant
router.put('/:id', auth, multerConfig.upload, multerConfig.convertToWebp, bookCtrl.modifyBook); // Modifie un livre existant
router.delete('/:id', auth, bookCtrl.deleteBook); // Supprime un livre existant
router.get('/bestrating', bookCtrl.getBestRatedBooks); // Récupère les livres les mieux notés
router.post('/:id/rating', auth, bookCtrl.rateBook); // Note un livre

module.exports = router;



