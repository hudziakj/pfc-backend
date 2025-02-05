const mongoose = require("../db/conn");
const { Schema } = mongoose;

const User = mongoose.model(
  "User",
  new Schema(
    {
      nome: {
        type: String,
        required: true,
      },
      departamento: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      senha: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
    },
    { timestamps: true }
  )
);

module.exports = User;
