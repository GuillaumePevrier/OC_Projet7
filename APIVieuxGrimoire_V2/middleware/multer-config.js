const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '_' + Date.now() + '.' + extension);
  }
});

const upload = multer({ storage: storage }).single('image');

// Middleware pour la conversion automatique en format webp et compression de l'image
const convertToWebp = (req, res, next) => {
  if (req.file) {
    const { path } = req.file;
    const webpPath = path.replace(/\.[^.]+$/, '.webp');
    sharp(path)
      .webp()
      .toFile(webpPath)
      .then(() => {
        // Supprimer l'image d'origine après la conversion en WebP
        fs.unlinkSync(path);
        // Optimiser la qualité de l'image WebP
        sharp(webpPath)
          .webp({ quality: 80 }) // Ajustez la qualité selon vos besoins
          .toFile(webpPath, () => {
            req.file.path = webpPath; // Met à jour le chemin du fichier avec le fichier webp optimisé
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
