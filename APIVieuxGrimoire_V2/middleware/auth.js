const jwt = require('jsonwebtoken');

// Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    // Extraire le token d'authentification du header Authorization de la requête
    const token = req.headers.authorization.split(' ')[1];
    // Décoder le token pour obtenir les informations qu'il contient
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // Extraire l'identifiant de l'utilisateur du token décodé
    const userId = decodedToken.userId;
    // Ajouter l'identifiant de l'utilisateur à l'objet req.auth
    req.auth = {
      userId: userId,
    };
    // Passer au middleware suivant
    next();
  } catch (error) {
    // En cas d'erreur lors de la vérification du token ou de l'extraction de l'identifiant
    res.status(401).json({ error });
  }
};

