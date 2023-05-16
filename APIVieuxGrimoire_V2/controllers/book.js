const Book = require('../models/book');
const fs = require('fs');

const sharp = require('sharp');


exports.createBook = async (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const webpFileName = req.file.filename.replace(/\.[^.]+$/, '.webp'); // Obtenir le nom de fichier WebP
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${webpFileName}`, // Utiliser le nom de fichier WebP pour le lien
    });

    await book.save();

    const link = `${req.protocol}://${req.get('host')}/images/${webpFileName}`;
    res.status(201).json({ message: 'Objet enregistré !', link });
  } catch (error) {
    res.status(400).json({ error });
  }
};





exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      res.status(404).json({
        error: error,
      });
    });
};

// Fonction de modification d'un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.error(err);
          }
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Objet supprimé !' });
            })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(400).json({
        error: error,
      });
    });
};

// Middleware pour obtenir les 3 livres avec la meilleure note moyenne
exports.getBestRatedBooks = async (req, res) => {
	try {
		const books = await Book.find()
			.sort({ averageRating: -1 })
			.limit(3);
		res.json(books);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des livres les mieux notés.' });
	}
};

exports.rateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, grade } = req.body;

    // Vérifier si l'utilisateur a déjà noté ce livre
    const book = await Book.findById(id);
    if (book.ratings.some(r => r.userId === userId)) {
      return res.status(400).json({ message: "L'utilisateur a déjà noté ce livre." });
    }

    // Ajouter la nouvelle notation à la liste des notations du livre
    book.ratings.push({ userId, rating, grade });

    // Calculer la nouvelle note moyenne du livre
    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce((total, r) => total + r.rating, 0);
    book.averageRating = sumRatings / totalRatings;

    // Enregistrer les modifications du livre dans la base de données
    await book.save();

    res.status(200).json({ message: 'La notation a été ajoutée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la notation du livre :', error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la notation du livre." });
  }
};


exports.getBook = (req, res, next) => {
  const { id } = req.params;

  // Vérifier si l'identifiant est "bestrating"
  if (id === "bestrating") {
    // Exécuter la logique pour récupérer les livres les mieux notés
    getBestRatedBooks(req, res, next);
  } else {
    // Exécuter la logique pour récupérer un livre par son identifiant
    getOneBook(req, res, next);
  }
};

// Logique pour récupérer les livres les mieux notés
const getBestRatedBooks = async (req, res, next) => {
  try {
    const books = await Book.find()
      .sort({ averageRating: -1 })
      .limit(3);
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des livres les mieux notés.' });
  }
};

// Logique pour récupérer un livre par son identifiant
const getOneBook = (req, res, next) => {
  const { id } = req.params;
  Book.findOne({ _id: id })
    .then(book => {
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: 'Livre non trouvé.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};
