const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

//@desc Create contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    console.log(req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const contact = await Contact.create({
        user_id: req.user.id,
        name: name,
        email: email,
        phone: phone,
    });
    res.status(201).json(contact);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    let contact;
    try{
        contact = await Contact.findById(req.params.id);
    }catch(err){
        console.log(err);
        if (err.name === 'CastError') {
            res.status(404);
            throw new Error("Contact not found");
        }
        res.status(500);
        throw new Error("Internal server error");
    }

    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Trying to fetch contact that user don't have permissions to.");
    }

    res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    let contact;
    try{
        contact = await Contact.findById(req.params.id);
    }catch(err){
        console.log(err);
        if (err.name === 'CastError') {
            res.status(404);
            throw new Error("Contact not found");
        }
        res.status(500);
        throw new Error("Internal server error");
    }
    
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Trying to update contact that user don't have permissions to.");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.status(200).json(updatedContact);
    
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    let contact;
    try{
        contact = await Contact.findById(req.params.id);
    }catch(err){
        console.log(err);
        if (err.name === 'CastError') {
            res.status(404);
            throw new Error("Contact not found");
        }
        res.status(500);
        throw new Error("Internal server error");
    }

    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Trying to delete contact that user don't have permissions to.");
    }

    const result = await Contact.deleteOne({_id: req.params.id});
    // Check if the contact was found and deleted
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Couldn't delete contact" });
    }
    
    res.status(200).json({ message: 'Contact deleted successfully' });
});

module.exports = { 
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact 
}