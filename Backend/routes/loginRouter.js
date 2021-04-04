const LoginController = require("../controllers/loginController");
//Express
const express = require("express");
const router = express.Router();

router.post("/login", LoginController.loginUser);

module.exports = router;