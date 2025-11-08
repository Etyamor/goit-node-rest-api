import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = (req, res, next) => {
  contactsService.listContacts()
    .then(contacts => res.json(contacts))
    .catch(() => next(HttpError(500)));
};

export const getOneContact = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(HttpError(400));
  }

  contactsService.getContactById(id)
    .then(contact => {
      if (!contact) {
        return next(HttpError(404));
      }
      res.json(contact);
    })
    .catch(() => next(HttpError(500)));
};


export const deleteContact = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(HttpError(400));
  }

  contactsService.removeContact(id)
    .then(deletedContact => {
      if (!deletedContact) {
        return next(HttpError(404));
      }
      res.json(deletedContact);
    })
    .catch(() => next(HttpError(500)));
};

export const createContact = (req, res, next) => {
  const { name, email, phone } = req.body;

  contactsService.addContact(name, email, phone)
    .then(newContact => res.status(201).json(newContact))
    .catch(() => next(HttpError(500)));
};

export const updateContact = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(HttpError(400));
  }

  contactsService.updateContact(id, req.body)
    .then(updatedContact => {
      if (!updatedContact) {
        return next(HttpError(404));
      }
      res.json(updatedContact);
    })
    .catch(() => next(HttpError(500)));
};
