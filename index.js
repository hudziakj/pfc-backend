const express = require("express");
const cors = require("cors");
const app = express();

// Conexão com o banco de dados
const coon = require("./db/conn.js");

// Middlewares
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:8080" }));
app.use(express.static("public"));

// Rotas
const UserRoutes = require("./routes/UserRoutes");
const TicketRoutes = require("./routes/TicketRoutes.js");

app.use("/users", UserRoutes);
app.use("/tickets", TicketRoutes);

// Rota padrão para erros de rota inexistente
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada!" });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno no servidor!" });
});

// Inicialização do servidor
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
