const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');
const multerConfig = require('../middleware/multer-config');

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multerConfig.upload, multerConfig.convertToWebp, bookCtrl.createBook);
router.get('/:id', bookCtrl.getBook); // Utilise la fonction getBook pour récupérer un livre par son identifiant
router.put('/:id', auth, multerConfig.upload, multerConfig.convertToWebp, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/bestrating', bookCtrl.getBestRatedBooks); // Nouvelle route pour les livres les mieux notés
router.post('/:id/rating', auth, bookCtrl.rateBook); // Nouvelle route pour noter un livre

module.exports = router;


