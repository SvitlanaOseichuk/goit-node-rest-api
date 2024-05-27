import {createContactSchema, updateContactSchema, updateFavoriteSchema} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contacts.js";
import mongoose from "mongoose";




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
            return next(HttpError(404));
        }

        res.status(200).send(contact);

    } catch (error) {
        next(error);
    }
};



export const deleteContact = async (req, res, next) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(HttpError(400, "Invalid ID format"));
    }

    try {
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (deletedContact === null) {
            return next(HttpError(404));
        } 

        res.status(200).send(deletedContact);

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


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(HttpError(400, "Invalid ID format"));
        }


        if (!name && !email && !phone) {
            return next(HttpError(400, "Body must have at least one field"));
        }

    
        const existingContact = await Contact.findById(id);
        if (!existingContact) {
            return next(HttpError(404));
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
        next(error);
    }
};



export const updateFavoriteContact = async (req, res, next) => {
    
    try {

        const { id } = req.params;
        const { favorite } = req.body;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(HttpError(400, "Invalid ID format"));
        }

        if (favorite === undefined) {
            return next(HttpError(400, "Missing field favorite"));
        }

        
        const existingContact = await Contact.findById(id);
        if (!existingContact) {
            return next(HttpError(404));
        }


        const updatedFavContact = {
            favorite: favorite !== undefined ? favorite : existingContact.favorite
        };


        const { error, value } = updateFavoriteSchema.validate(updatedFavContact);
        if (error) {
            return next(HttpError(400, error.message));
        }

        
        const newContact = await updateStatusContact(id, updatedFavContact, { new: true });

        res.status(200).json(newContact);

    } catch (error) {        
        next(error);
    }
};


const updateStatusContact = async (id, body) => {

    const existingContact = await Contact.findById(id);
    if (!existingContact) {
        return next(HttpError(404));
    }

    existingContact.favorite = body.favorite;

    await existingContact.save();
    
    return existingContact;
};