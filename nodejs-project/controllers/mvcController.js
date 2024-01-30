const asyncHandler = require("express-async-handler");
const { 
    getContact, 
} = require("../controllers/contactController");

const index = (req, res) => {
    res.render('index');
}

const login = (req, res) => {
    res.render('login');
}

const register = (req, res) => {
    res.render('register');
}

const registerSuccess = (req, res) => {
    const email = req.query.email

    res.render('registerSuccess', { email });
}

const addContact = (req, res) => {
    res.render('addContact');
}

const editContact = (req, res) => {
    res.render('editContact');
}

const contact = (req, res) => {
    res.render('contact');
}

module.exports = { index, login, register, registerSuccess, addContact, editContact, contact }