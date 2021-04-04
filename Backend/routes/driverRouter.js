const DriverController = require("../controllers/driverController");
//Express
const express = require("express");
const router = express.Router();

router.post("/signup", DriverController.createDriver);


module.exports = router;