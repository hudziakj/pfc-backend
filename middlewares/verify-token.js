const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho de autorização está presente
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Acesso negado! Token não fornecido." });
  }

  const token = authHeader.split(" ")[1]; // Extraindo o token do cabeçalho

  // Verifica se o token foi fornecido no formato correto
  if (!token) {
    return res.status(401).json({ message: "Acesso negado! Token ausente." });
  }

  try {
    // Verifica e decodifica o token
    const verificado = jwt.verify(token, "nossosecret"); // Use a mesma chave secreta usada na criação do token
    req.user = verificado; // Anexa os dados do usuário ao `req` para uso futuro
    next();
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return res.status(401).json({ message: "Token inválido ou expirado!" });
  }
};

module.exports = verificarToken;
