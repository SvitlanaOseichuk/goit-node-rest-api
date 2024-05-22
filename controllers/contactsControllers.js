import contactsService from "../services/contactsServices.js";
import {createContactSchema, updateContactSchema} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";
import crypto from "node:crypto";



export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).send(contacts);
    } catch (error) {
        next(error);
    }
};



export const getOneContact = async (req, res, next) => {
   
    const { id } = req.params;
    try {
        const contact = await contactsService.getContactById(id);
        if (contact) {
            res.status(200).json(contact);
        } else {
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error);
    }
};



export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedContact = await contactsService.removeContact(id);
        if (deletedContact) {
            res.status(200).json(deletedContact);
        } else {
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error);
    }
};



export const createContact = async (req, res, next) => {
    const { name, email, phone } = req.body;
    
    const contact = { name, email, phone };
    const { error, value } = createContactSchema.validate(contact);

    if (error) {
        return next(HttpError(400, error.message));
    }

    try {
        const newContact = await contactsService.addContact(contact);
        res.status(201).json({
            id: crypto.randomUUID(),
            name: value.name,
            email: value.email,
            phone: value.phone
        });
    } catch (error) {
        next(error);
    }
};




export const updateContact = async (req, res, next) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
        return next(HttpError(400, "Body must have at least one field"));
    }

    try {
        const existingContact = await contactsService.getContactById(id);
        if (!existingContact) {
            return res.status(404).json({ message: 'Not found' });
        }

        const updatedContact = {
            name: name !== undefined ? name : existingContact.name,
            email: email !== undefined ? email : existingContact.email,
            phone: phone !== undefined ? phone : existingContact.phone
        };

        const { error, value } = updateContactSchema.validate(updatedContact);
        if (error) {
            return next(HttpError(400, error.message));
        }

        const newContact = await contactsService.updateContact(id, updatedContact);
        res.status(200).json(newContact);
    } catch (error) {
        if (error.message === 'Not found') {
            return res.status(404).json({ message: 'Not found' });
        }
        next(error);
    }
};
