import contactsService from "../services/contactsServices.js";
import {createContactSchema, updateContactSchema} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";
import crypto from "node:crypto";


//getALL
export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).send(contacts);
    } catch (error) {
        next(error);
    }
};


// get 1
export const getOneContact = async (req, res, next) => {
   
    const { id } = req.params;
    try {
        const contact = await contactsService.getContactById(id);
        if (contact) {
            res.status(200).json(contact);
        } else {
            // HttpError(404, "Not found" );
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error);
    }
};


// delete
export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedContact = await contactsService.removeContact(id);
        if (deletedContact) {
            res.status(200).json(deletedContact);
        } else {
            // res.status(404).send("Not found");
            throw HttpError(404, "Not found");
        }
    } catch (error) {
        next(error);
    }
};



//post    створення 
// export const createContact = async (req, res, next ) => {
//     const { name, email, phone } = req.body;

//     const contact = {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone
//     }

    
//     const { error, value} = createContactSchema.validate(contact)



//     try {
//         const newContact = await contactsService.addContact({ name, email, phone });
//         if (typeof error !== "undefined") {
//             return res
//               .status(400)
//               .send(error.details.map((error) => error.message).join(", "));
//           }
        
//         res.status(201).json({
//             id: crypto.randomUUID(),
//             name: value.name,
//             email: value.email,
//             phone: value.phone
//         })

//         res.status(201).json(newContact);
//     } catch (error) {
//         next(error);
//     };
// }

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
        const newContact = await contactsService.updateContact(id, { name, email, phone });
        res.status(200).json(newContact);
    } catch (error) {
        if (error.message === 'Not found') {
            return res.status(404).json({ message: 'Not found' });
        }
        next(error);
    }
};

//     try {
//         const existingContact = await getOneContact(id);
//         if (!existingContact) {
//             return res.status(404).json({ message: "Not found" });
//         }

//         const updatedContact = {
//             ...existingContact,
//             ...(name && { name }),
//             ...(email && { email }),
//             ...(phone && { phone })
//         };

//         const { error } = updateContactSchema.validate(updatedContact);
//         if (error) {
//             throw HttpError(400, error.message);
//         }

//         const result = await updateContact(id, updatedContact);
//         res.status(200).json(result);
//     } catch (error) {
//         next(error);
//     }
// };

//дописвть валідацію

// //put
// export const updateContact = async (req, res, next) => {

//     const { id } = req.params;
//     const { error, value} = updateContact.validate(newContact)
//     const { name, email, phone } = req.body;

//     try {
//         const newContact = await contactsService.updateContact(id, name, email, phone );
//         if (typeof error !== "undefined") {
//             // return res
//         //       .status(404)
//         //       .send(error.details.map((error) => error.message).join(", "));
//              throw HttpError(400, error.message)
//         }
        
//              const updatedContact = {
//     ...existingContact,
//     ...(name && { name }),
//     ...(email && { email }),
//     ...(phone && { phone })
// };


//         res.status(201).json(updatedContact);
//     } catch (error) {
//         next(error);
// };
// }

