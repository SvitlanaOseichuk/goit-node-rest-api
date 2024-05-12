import contactsService from "../services/contactsServices.js";

// const { listContacts } = contactsService;
// const { getContactById } = contactsService
// const { removeContact } = contactsService
// const { addContact } = contactsService


import HttpError from "../helpers/HttpError.js"


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
            HttpError(404, "Not found" );
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
            HttpError(404, "Not found" );
        }
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const newContact = await contactsService.addContact({ name, email, phone });
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = (req, res) => {};

