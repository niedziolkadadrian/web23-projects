const express = require("express");
const router = express.Router();
const { 
    index, 
} = require("../controllers/mvcController");

router.get("/", index);

module.exports = router;