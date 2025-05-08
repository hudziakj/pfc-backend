const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

const upload = require("../config/multer-config");

router.post("/registrar", upload.single("avatar"), UserController.registrar);
router.post("/autenticar", UserController.autenticar);
router.get("/listar", UserController.obterTodosUsuarios);
router.get("/:id", UserController.obterUsuario);

module.exports = router;
