const mongoose = require("../db/conn");
const { Schema } = mongoose;

const CommentCounter = mongoose.model(
  "commentCounter", // Nome da coleção de contadores de comentários
  new Schema(
    {
      collectionName: {
        type: String,
        required: true,
        unique: true, // Cada coleção terá um contador único
        default: "Comment", // Nome da coleção de comentários
      },
      seq: {
        type: Number,
        required: true,
        default: 0, // Inicia com 0
      },
    },
    { timestamps: true } // Garante as datas de criação e atualização
  )
);

module.exports = CommentCounter;
