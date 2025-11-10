import Contact from '../models/contact.js';

async function listContacts() {
  return await Contact.findAll();
}

async function getContactById(contactId) {
  return await Contact.findByPk(contactId);
}

async function addContact(name, email, phone) {
  return await Contact.create({
    name,
    email,
    phone,
  });
}

async function removeContact(contactId) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
}

async function updateContact(contactId, updatedFields) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  await contact.update(updatedFields);
  return contact;
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
