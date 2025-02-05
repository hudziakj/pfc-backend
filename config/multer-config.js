const multer = require("multer");

const storage = multer.memoryStorage(); // Salvar imagem em memória para usar buffer
const fileFilter = (req, file, cb) => {
  const allowedMimetypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de arquivo inválido. Use JPEG ou PNG."), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
