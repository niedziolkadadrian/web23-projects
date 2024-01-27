const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")
//@desc Get all contacts
//@route GET /api/contacts
//@access public
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find()
    res.status(200).json(contacts);
});

//@desc Create contact
//@route POST /api/contacts
//@access public
const createContact = asyncHandler(async (req, res) => {
    console.log(req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const contact = await Contact.create({
        name: name,
        email: email,
        phone: phone,
    });
    res.status(201).json(contact);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access public
const getContact = asyncHandler(async (req, res) => {
    try{
        const contact = await Contact.findById(req.params.id);
        if(!contact){
            res.status(404);
            throw new Error("Contact not found");
        }
        res.status(200).json(contact);
    }catch(err){
        if (err.name === 'CastError') {
            res.status(404);
            throw new Error("Contact not found");
        }
        res.status(500);
        throw new Error("Internal server error");
    }
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async (req, res) => {
    try{
        const contact = await Contact.findById(req.params.id);
        if(!contact){
            res.status(404);
            throw new Error("Contact not found");
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json(updatedContact);
    }catch(err){
        if (err.name === 'CastError') {
            res.status(404);
            throw new Error("Contact not found");
        }
        res.status(500);
        throw new Error("Internal server error");
    }
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async (req, res) => {
    try{
        const result = await Contact.deleteOne({ _id: req.params.id });
        // Check if the contact was found and deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    }catch(err){
        if (err.name === 'CastError') {
            res.status(404);
            throw new Error("Contact not found");
        }
        res.status(500);
        throw new Error("Internal server error");
    }
});

module.exports = { 
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact 
}