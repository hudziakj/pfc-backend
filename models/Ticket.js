const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Ticket = mongoose.model(
  "Ticket",
  new Schema(
    {
      id: {
        type: Number,
        required: true,
      },
      titulo: {
        type: String,
        required: true,
      },
      descricao: {
        type: String,
        required: true,
      },
      andamento: {
        type: String,
        enum: ["Aberto", "Em Progresso", "Fechado"], // Status do chamado
        default: "Aberto", // Status inicial
        required: true,
      },
      categoria: {
        type: String,
        required: true, // Categoria do chamado (ex: "Suporte", "Manutenção")
      },
      requerente: {
        type: mongoose.Schema.Types.ObjectId, // Referência ao modelo User
        ref: "User", // Nome do modelo relacionado
        required: true,
      },
      responsavel: {
        type: mongoose.Schema.Types.ObjectId, // Referência ao modelo User
        ref: "User", // Nome do modelo relacionado
        required: true,
      },
      comentarios: [
        {
          _id: { type: Number }, // Altere para Number
          usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          comentario: { type: String, required: true },
          data: { type: Date, default: Date.now },
          nome: { type: String },
        },
      ],
    },
    { timestamps: true } // Garante que o mongoose armazene as datas de criação e atualização automaticamente
  )
);

module.exports = Ticket;
