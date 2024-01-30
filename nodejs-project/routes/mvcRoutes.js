const express = require("express");
const router = express.Router();
const { 
    index,
    login,
    register,
    registerSuccess,
    addContact,
    editContact, 
    contact
} = require("../controllers/mvcController");

router.get("/", index);

router.get("/login", login);
router.get("/register", register);
router.get("/register/success", registerSuccess);


router.get("/contacts/add", addContact);
router.get("/contacts/:id", contact);
router.get("/contacts/edit/:id", editContact);

module.exports = router;