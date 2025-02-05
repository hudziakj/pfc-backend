const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Comment = mongoose.model(
  "Comment",
  new Schema(
    {
      ticketId: {
        type: Schema.Types.ObjectId,
        ref: "Ticket", // Referência ao modelo de chamado (Ticket)
        required: true, // O comentário precisa estar vinculado a um chamado
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Referência ao modelo de usuário (User)
        required: true, // O comentário precisa ter um autor
      },
      content: {
        type: String,
        required: true, // O conteúdo do comentário é obrigatório
      },
      // Aqui você pode adicionar outros campos conforme necessário, como status de moderação, anexos, etc.
    },
    { timestamps: true } // Garante as datas de criação e atualização do comentário
  )
);

module.exports = Comment;
