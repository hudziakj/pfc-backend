const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Counter = mongoose.model(
  "Counter",
  new Schema(
    {
      collectionName: {
        type: String,
        required: true, // Nome da coleção a ser gerenciada
        unique: true, // Cada coleção terá um contador único
      },
      seq: {
        type: Number,
        required: true, // Valor incremental
        default: 0, // Inicia com 0
      },
    },
    { timestamps: true } // Garante as datas de criação e atualização
  )
);

module.exports = Counter;
