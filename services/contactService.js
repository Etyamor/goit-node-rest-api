import Contact from '../models/Contact.js';

async function listContacts(userId) {
  return await Contact.findAll({ where: { owner: userId } });
}

async function getContactById(contactId, userId) {
  return await Contact.findOne({ where: { id: contactId, owner: userId } });
}

async function addContact(name, email, phone, userId) {
  return await Contact.create({
    name,
    email,
    phone,
    owner: userId,
  });
}

async function removeContact(contactId, userId) {
  const contact = await Contact.findOne({ where: { id: contactId, owner: userId } });
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
}

async function updateContact(contactId, userId, updatedFields) {
  const contact = await Contact.findOne({ where: { id: contactId, owner: userId } });
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
