const Ticket = require("../models/Ticket"); // Importa o modelo de Ticket
const CommentCounter = require("../models/CommentCounter"); // Importa o modelo de contador de comentários
const Counter = require("../models/Counter"); // Importa o modelo de contador de comentários
const mongoose = require("mongoose"); // Adicione esta linha

// Adicionar um comentário ao chamado
const addComment = async (req, res) => {
  const { comentario, usuarioId, nome } = req.body;
  const ticketId = req.params.id;

  if (!comentario || !usuarioId || !nome) {
    return res
      .status(400)
      .json({ message: "Comentário e usuário são obrigatórios" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "ID do chamado inválido." });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Chamado não encontrado." });
    }

    // Obtém o contador de comentários e incrementa
    const counter = await CommentCounter.findOneAndUpdate(
      { collectionName: "Comment" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // Cria o contador caso não exista
    );

    const comentarioId = counter.seq; // ID único gerado pelo contador

    // Adiciona o comentário ao array de comentários do ticket com o ID único
    ticket.comentarios.push({
      _id: comentarioId, // Contador
      usuario: usuarioId,
      comentario,
      nome,
      data: new Date(),
    });

    await ticket.save();

    res
      .status(201)
      .json({ message: "Comentário adicionado com sucesso.", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar comentário." });
  }
};

// Função para buscar um chamado específico, incluindo seus comentários
const getById = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await Ticket.findOne({ id: ticketId })
      .populate("responsavel", "nome")
      .populate("requerente", "nome")
      .populate("comentarios.usuario", "nome avatar") // Popula o usuário com nome e avatar
      .exec();

    if (!ticket) {
      return res.status(404).json({ message: "Chamado não encontrado." });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar o chamado." });
  }
};

// Criar um novo chamado
const create = async (req, res) => {
  try {
    const { titulo, descricao, categoria, responsavel, requerente } = req.body;
    // Gera o próximo número de ID para o ticket
    const counter = await Counter.findOneAndUpdate(
      { collectionName: "tickets" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // Cria o documento se não existir
    );

    const numeroChamado = counter.seq;
    const userId = req.user._id;
    // Cria um novo chamado com os dados recebidos
    const newTicket = new Ticket({
      id: numeroChamado,
      titulo,
      descricao,
      categoria,
      responsavel,
      requerente,
    });

    // Salva o novo chamado no banco de dados
    await newTicket.save();

    // Retorna o chamado criado com status 201 (Created)
    res.status(201).json(newTicket);
  } catch (error) {
    console.log(error);
    // Em caso de erro, retorna um erro com status 500 (Internal Server Error)
    res.status(500).json({ error: "Erro ao criar o chamado." });
  }
};

const get = async (req, res) => {
  try {
    const userId = req.query.userId.replace(/['"]+/g, "");
    console.log(userId);
    console.log("UserId recebido:", userId);

    // Filtra os chamados onde o requerente ou o responsável é o userId
    const tickets = await Ticket.find({
      $or: [{ requerente: userId }, { responsavel: userId }],
    })
      .populate("requerente", "nome")
      .populate("responsavel", "nome")
      .exec();

    res.status(200).json(tickets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao buscar chamados", error: err.message });
  }
};

module.exports = { create, get, getById, addComment };
