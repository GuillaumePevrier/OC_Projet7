// Ce fichier joue le rôle de créer et configurer un serveur HTTP en 
// utilisant le module 'http', en normalisant le port, en gérant les erreurs 
// liées à l'écoute du serveur et en démarrant le serveur pour écouter les 
// requêtes entrantes sur le port spécifié.

const http = require('http'); 
const app = require('./app'); 
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; 
  }
  if (port >= 0) {
    return port; 
  }
  return false; 
};

const port = normalizePort(process.env.PORT || '3000'); 
app.set('port', port); 

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error; 
  }
  const address = server.address(); 
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; 
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.'); 
      process.exit(1); 
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.'); 
      process.exit(1); 
      break;
    default:
      throw error; 
  }
};

const server = http.createServer(app); 
server.on('error', errorHandler); 
server.on('listening', () => {
  const address = server.address(); 
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; 
  console.log('Listening on ' + bind);
});

server.listen(port); 