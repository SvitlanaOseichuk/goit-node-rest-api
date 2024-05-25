import {createContactSchema, updateContactSchema, updateFavoriteSchema} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contacts.js"




export const getAllContacts = async (req, res, next) => {

    try {
        const contacts = await Contact.find();

        res.status(200).send(contacts);

    } catch (error) {
        next(error);
    }
};



export const getOneContact = async (req, res, next) => {
   
    const { id } = req.params;

    try {
        const contact = await Contact.findById(id);

        if (contact === null) {
            throw HttpError(404, "Not found");
        }

        res.status(200).send(contact);

    } catch (error) {
        next(error);
    }
};



export const deleteContact = async (req, res, next) => {

    const { id } = req.params;

    try {
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (deletedContact === null) {
            throw HttpError(404, "Not found");
        } 

        res.status(200).end();

    } catch (error) {
        next(error);
    }
};



export const createContact = async (req, res, next) => {
    
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        favorite: req.body.favorite
    }


    const { error, value } = createContactSchema.validate(contact);

    if (error) {
        return next(HttpError(400, error.message));
    }

    try {
        const newContact = await Contact.create(contact);
        
        res.status(200).send(newContact);

    } catch (error) {
        next(error);
    }
};



export const updateContact = async (req, res, next) => {

    try {

        const { id } = req.params;
        const { name, email, phone, favorite } = req.body;

        const contact = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            favorite: req.body.favorite
        }


        if (!name && !email && !phone) {
            return next(HttpError(400, "Body must have at least one field"));
        }

    
        const existingContact = await Contact.findById(id);
        if (!existingContact) {
            throw HttpError(404, "Not found");
        }


        const updatedContact = {
            name: name !== undefined ? name : existingContact.name,
            email: email !== undefined ? email : existingContact.email,
            phone: phone !== undefined ? phone : existingContact.phone,
            favorite: favorite !== undefined ? favorite : existingContact.favorite
        };


        const { error, value } = updateContactSchema.validate(updatedContact);
        if (error) {
            return next(HttpError(400, error.message));
        }

        
        const newContact = await Contact.findByIdAndUpdate(id, updatedContact, { new: true });

        res.status(200).json(newContact);

    } catch (error) {
        
        if (error.message === 'Not found') {
            throw HttpError(404, "Not found");
        }
        
        next(error);
    }
};



export const updateFavoriteContact = async (req, res, next) => {
    
    try {

        const { id } = req.params;
        const { name, email, phone, favorite } = req.body;


        if (favorite === undefined) {
            return next(HttpError(400, "Missing field favorite"));
        }

        
        const existingContact = await Contact.findById(id);
        if (!existingContact) {
            throw HttpError(404, "Not found");
        }


        const updatedContact = {
            name: name !== undefined ? name : existingContact.name,
            email: email !== undefined ? email : existingContact.email,
            phone: phone !== undefined ? phone : existingContact.phone,
            favorite: favorite !== undefined ? favorite : existingContact.favorite
        };


        const { error, value } = updateContactSchema.validate(updatedContact);
        if (error) {
            return next(HttpError(400, error.message));
        }

        
        const newContact = await updateStatusContact(id, updatedContact, { new: true });

        res.status(200).json(newContact);

    } catch (error) {
        
        if (error.message === 'Not found') {
            throw HttpError(404, "Not found");
        }
        
        next(error);
    }
};


const updateStatusContact = async (id, body) => {

    const existingContact = await Contact.findById(id);

    if (!existingContact) {
        throw new Error("Not found");
    }

    existingContact.favorite = body.favorite;

    await existingContact.save();
    
    return existingContact;
};