const mongoose = require("mongoose");
require("dotenv").config(); // Carrega variáveis de ambiente do arquivo .env

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Conectou ao Mongoose!");
}

main().catch((err) => console.log("Erro ao conectar no MongoDB:", err));

module.exports = mongoose;
