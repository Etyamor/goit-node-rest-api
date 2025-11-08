import HttpError from "../helpers/HttpError.js";

export const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(HttpError(500));
    }
  };
};
