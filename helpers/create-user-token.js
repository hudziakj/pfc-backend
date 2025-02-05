const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      id: user._id, // ID do usuário
      nome: user.nome, // Nome do usuário
    },
    "nossosecret", // Use uma chave secreta forte
    { expiresIn: "1d" } // Token expira em 1 dia
  );
  console.log(user);
  res.status(200).json({
    message: "Registrado com sucesso!",
    token: token,
    userId: user._id, // Retorna ID do usuário
    nome: user.nome, // Retorna o nome do usuário
  });
};

module.exports = createUserToken;
