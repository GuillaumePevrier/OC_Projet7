const http = require('http'); // Importation du module 'http' pour créer un serveur HTTP
const app = require('./app'); // Importation de l'application

// Fonction pour normaliser le port
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // Retourne la valeur telle quelle si elle n'est pas un nombre
  }
  if (port >= 0) {
    return port; // Retourne le numéro de port si la valeur est un nombre positif
  }
  return false; // Retourne false si la valeur n'est pas valide
};

const port = normalizePort(process.env.PORT || '3000'); // Normalisation du port
app.set('port', port); // Définition du port de l'application

// Fonction de gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error; // Lève une erreur si l'erreur n'est pas liée à l'écoute du serveur
  }
  const address = server.address(); // Récupération de l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Formatage de l'adresse
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.'); // Affiche un message d'erreur si l'accès est refusé
      process.exit(1); // Arrête le processus avec le code d'erreur 1
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.'); // Affiche un message d'erreur si le port est déjà utilisé
      process.exit(1); // Arrête le processus avec le code d'erreur 1
      break;
    default:
      throw error; // Lève une erreur pour les autres cas d'erreur
  }
};

const server = http.createServer(app); // Création du serveur HTTP avec l'application

server.on('error', errorHandler); // Gestion des erreurs du serveur
server.on('listening', () => {
  const address = server.address(); // Récupération de l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Formatage de l'adresse
  console.log('Listening on ' + bind); // Affiche un message indiquant que le serveur écoute sur le port spécifié
});

server.listen(port); // Démarrage du serveur et écoute des requêtes entrantes
