const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/TicketController");
const verifyToken = require("../middlewares/verify-token");

router.post("/create", verifyToken, TicketController.create);
router.get("/", verifyToken, TicketController.get);
router.get("/:id", verifyToken, TicketController.getById);
router.post("/:id/comentarios", verifyToken, TicketController.addComment);

module.exports = router;
