import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(HttpError(400));
  }

  const contact = await contactsService.getContactById(id);
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

  const deletedContact = await contactsService.removeContact(id);
  if (!deletedContact) {
    return next(HttpError(404));
  }
  res.json(deletedContact);
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  const newContact = await contactsService.addContact(name, email, phone);
  res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(HttpError(400));
  }

  const updatedContact = await contactsService.updateContact(id, req.body);
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