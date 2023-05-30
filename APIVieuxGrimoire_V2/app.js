// Ce fichier crée et configure une application Express, 
// définit des routes pour les livres et les utilisateurs, 
// gère les autorisations d'accès et se connecte à une base de données MongoDB.
// Il permet également de servir des images en tant que fichiers statiques.

const express = require('express'); 
const app = express(); 
const mongoose = require('mongoose'); 
const bookRoutes = require('./routes/book'); 
const userRoutes = require('./routes/user'); 
const path = require('path'); 

mongoose
  .connect('mongodb+srv://Accesscab1983:Accesscab1983@cluster0.le9npv3.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !')) 
  .catch(() => console.log('Connexion à MongoDB échouée !')); 

app.use(express.json()); 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
  next();
});

app.use('/api/books', bookRoutes); 
app.use('/api/auth', userRoutes); 
app.use('/images', express.static(path.join(__dirname, 'images'))); 

module.exports = app; 
