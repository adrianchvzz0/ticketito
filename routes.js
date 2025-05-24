const express = require("express");
const eventRoutes = require("./eventController");
const uploadRoutes = require("./uploadController");
const paymentRoutes = require("./paymentController");
const createCheckoutSessionRoutes = require("./createCheckoutSession");

//Define rutas
const router = express.Router();
router.use("/events", eventRoutes);
router.use("/upload", uploadRoutes);
router.use("/payment", paymentRoutes);
router.use("/payment", createCheckoutSessionRoutes);


module.exports = router;
