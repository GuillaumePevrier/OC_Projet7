// Ce fichier est un middleware d'authentification qui vérifie la validité 
// d'un token d'authentification présent dans le header "Authorization" 
// de la requête, décode ce token pour obtenir l'identifiant de l'utilisateur, 
// et ajoute cet identifiant à l'objet "req.auth" avant de passer au middleware 
// suivant ; en cas d'erreur, il renvoie une réponse d'erreur avec le statut 401.

const jwt = require('jsonwebtoken');

// Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Requête non autorisée !' });
  }
};

