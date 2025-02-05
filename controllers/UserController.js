const User = require("../models/User");
const bcrypt = require("bcrypt");
const createUserToken = require("../helpers/create-user-token");

module.exports = class UserController {
  static async register(req, res) {
    const { nome, email, departamento, senha, confirmaSenha } = req.body;

    // Validações
    if (!nome)
      return res.status(422).json({ message: "O nome é obrigatório!" });
    if (!email)
      return res.status(422).json({ message: "O e-mail é obrigatório!" });
    if (!senha)
      return res.status(422).json({ message: "A senha é obrigatória!" });
    if (!confirmaSenha) {
      return res
        .status(422)
        .json({ message: "A confirmação de senha é obrigatória!" });
    }
    if (senha !== confirmaSenha) {
      return res
        .status(422)
        .json({ message: "A senha e a confirmação precisam ser iguais!" });
    }

    try {
      // Verifica se o e-mail já está registrado
      const usuarioExiste = await User.findOne({ email });
      if (usuarioExiste) {
        return res.status(422).json({ message: "E-mail já cadastrado!" });
      }

      // Cria o hash da senha
      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(senha, salt);

      // Lida com o avatar enviado
      let avatar = null;
      if (req.file) {
        // Converte o Buffer da imagem para base64
        avatar = req.file.buffer.toString("base64");
      }

      // Cria o objeto do usuário
      const user = new User({
        nome,
        email,
        departamento,
        senha: senhaHash,
        avatar, // Salva a imagem como base64
      });

      // Salva o usuário no banco de dados
      const novoUsuario = await user.save();

      // Gera o token do usuário
      await createUserToken(novoUsuario, req, res);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao registrar usuário.", error: error.message });
    }
  }

  static async login(req, res) {
    const { email, senha } = req.body;

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      return;
    }

    if (!senha) {
      res.status(422).json({ message: "A senha é obrigatória!" });
      return;
    }

    const usuario = await User.findOne({ email: email });

    if (!usuario) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    // Checar senha
    const checarSenha = await bcrypt.compare(senha, usuario.senha);

    if (!checarSenha) {
      res.status(422).json({ message: "Senha inválida!" });
      return;
    }

    // Gera o token do usuário
    await createUserToken(usuario, req, res);
  }

  static async getUser(req, res) {
    try {
      // Recupere o ID do usuário através do token ou query params
      const userId = req.params.id;

      // Encontre o usuário no banco de dados
      const user = await User.findById(userId, "-senha"); // Exclui a senha do retorno

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado!" });
      }

      res.status(200).json(user); // Retorna o usuário, incluindo o avatar (base64)
    } catch (error) {
      res.status(500).json({
        message: "Erro ao recuperar o usuário.",
        error: error.message,
      });
    }
  }

  static async getAllUsers(req, res) {
    try {
      // Busca todos os usuários no banco de dados
      const users = await User.find();
      res.status(200).json(users); // Retorna os usuários em formato JSON
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar usuários", error: err });
    }
  }
};
