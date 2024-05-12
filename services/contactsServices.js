import * as fs from "fs/promises";
import path from "path";
import crypto from "crypto"


const contactsPath = path.resolve("db", "contacts.json");


async function readFile() {
    const data = await fs.readFile(contactsPath, {encoding: "utf-8"});
    return JSON.parse(data);
}

async function writeFile(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}



async function listContacts() {
    const contacts = await readFile();

    
    return contacts;
}
  


async function getContactById(id) {
    const contacts = await readFile();

    const contact = contacts.find(contact => contact.id === id);

    if (typeof contact === "undefined") {
      return null;
    }

    return contact;
}
  

async function removeContact(id) {
    const contacts = await readFile();

    const index = contacts.findIndex((contact) => contact.id === id)

    if (index === -1) {
      return null;
    }

    const removedContact = contacts[index];

    const newContact = [ ...contacts.slice(0, index), ...contacts.slice(index + 1)];

    await writeFile(newContact);

    return removedContact
}
  
async function addContact(contact) {
    const contacts = await readFile();

    const newContact = {...contact, id: crypto.randomUUID() };

    contacts.push(newContact);
    
    await writeFile(contacts);

    return newContact;
}
  

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact
}