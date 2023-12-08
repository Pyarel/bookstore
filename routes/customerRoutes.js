const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/register", customerController.registerUser);
router.post("/login", customerController.loginUser);
router.get("/", customerController.loginUser);
// router.get('/profile', customerController.getProfile);

module.exports = router;
