import contactsService from "../services/contactService.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const filter = {};

  if (req.query.favorite !== undefined) {
    filter.favorite = req.query.favorite === 'true';
  }

  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const contacts = await contactsService.listContacts(req.user.id, filter, page, limit);
  res.json(contacts);
};

const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(HttpError(400));
  }

  const contact = await contactsService.getContactById(id, req.user.id);
  if (!contact) {
    return next(HttpError(404));
  }
  res.json(contact);
};


const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(HttpError(400));
  }

  const deletedContact = await contactsService.removeContact(id, req.user.id);
  if (!deletedContact) {
    return next(HttpError(404));
  }
  res.json(deletedContact);
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  const newContact = await contactsService.addContact(name, email, phone, req.user.id);
  res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(HttpError(400));
  }

  const updatedContact = await contactsService.updateContact(id, req.user.id, req.body);
  if (!updatedContact) {
    return next(HttpError(404));
  }
  res.json(updatedContact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
};