const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // Spécifie le répertoire de destination des fichiers
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // Génère un nom de fichier en remplaçant les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype]; // Obtient l'extension du fichier en fonction du type MIME
    callback(null, name + '_' + Date.now() + '.' + extension); // Spécifie le nom complet du fichier en utilisant le nom d'origine, la date actuelle et l'extension
  }
});

// Configuration de l'upload des fichiers avec Multer
const upload = multer({ storage: storage }).single('image');

// Middleware pour la conversion automatique en format WebP et la compression de l'image
const convertToWebp = (req, res, next) => {
  if (req.file) {
    const { path } = req.file;
    const webpPath = path.replace(/\.[^.]+$/, '.webp'); // Remplace l'extension du fichier par .webp

    // Conversion de l'image en WebP
    sharp(path)
      .webp()
      .toFile(webpPath)
      .then(() => {
        // Suppression de l'image d'origine après la conversion en WebP
        fs.unlinkSync(path);

        // Optimisation de la qualité de l'image WebP
        sharp(webpPath)
          .webp({ quality: 80 }) // Ajustez la qualité selon vos besoins
          .toFile(webpPath, () => {
            req.file.path = webpPath; // Met à jour le chemin du fichier avec le fichier WebP optimisé
            next();
          });
      })
      .catch(error => {
        next(error);
      });
  } else {
    next();
  }
};

module.exports = { upload, convertToWebp };
