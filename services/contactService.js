import Contact from '../models/Contact.js';

async function listContacts(userId, filter = {}, page = 1, limit = 20) {
  const where = { owner: userId };

  if (filter.favorite !== undefined) {
    where.favorite = filter.favorite;
  }

  const offset = (page - 1) * limit;

  return await Contact.findAll({
    where,
    limit,
    offset
  });
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
