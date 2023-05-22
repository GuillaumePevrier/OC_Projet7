const express = require('express'); // Importation du module 'express' pour créer une application Express
const app = express(); // Création de l'application

const mongoose = require('mongoose'); // Importation du module 'mongoose' pour intéragir avec MongoDB

const bookRoutes = require('./routes/book'); // Importation des routes pour les livres
const userRoutes = require('./routes/user'); // Importation des routes pour les utilisateurs
const path = require('path'); // Importation du module 'path' pour gérer les chemins de fichiers

mongoose
  .connect('mongodb+srv://Accesscab1983:Accesscab1983@cluster0.le9npv3.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !')) // Affiche un message si la connexion à MongoDB est réussie
  .catch(() => console.log('Connexion à MongoDB échouée !')); // Affiche un message si la connexion à MongoDB échoue

app.use(express.json()); // Middleware pour parser les données JSON

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines d'accéder à l'API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Autorise les en-têtes spécifiés
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Autorise les méthodes spécifiées
  next();
});

app.use('/api/books', bookRoutes); // Utilise les routes pour les livres à l'URL '/api/books'
app.use('/api/auth', userRoutes); // Utilise les routes pour les utilisateurs à l'URL '/api/auth'
app.use('/images', express.static(path.join(__dirname, 'images'))); // Définit un dossier statique pour servir les images

module.exports = app; // Exporte l'application pour pouvoir l'utiliser dans d'autres fichiers
