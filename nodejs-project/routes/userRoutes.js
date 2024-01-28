const express = require("express");
const router = express.Router();
const { 
    registerUser, 
    loginUser,
    currentUser,
    renewTokenUser 
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");


router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.post("/renew-token", validateToken, renewTokenUser);

module.exports = router;