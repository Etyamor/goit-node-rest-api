import passport from '../config/passport.js';
import HttpError from '../helpers/HttpError.js';

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      throw HttpError(401);
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default authenticate;

