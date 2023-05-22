const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
  // Hasher le mot de passe avec un coût de hachage de 10
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // Créer un nouvel utilisateur avec l'e-mail et le mot de passe haché
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Enregistrer l'utilisateur dans la base de données
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  // Rechercher l'utilisateur dans la base de données par son adresse e-mail
  User.findOne({ email: req.body.email })
    .then(user => {
      // Vérifier si l'utilisateur existe
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // Comparer le mot de passe saisi avec le mot de passe stocké haché
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // Vérifier si le mot de passe est valide
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // Générer un jeton d'authentification avec l'identifiant de l'utilisateur
          const token = jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
          // Renvoyer l'identifiant de l'utilisateur et le jeton d'authentification au client
          res.status(200).json({
            userId: user._id,
            token: token,
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
