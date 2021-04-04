const PassengerController = require("../controllers/passengerController");
//Express
const express = require("express");
const router = express.Router();

router.post("/signup", PassengerController.createPassenger);

module.exports = router;