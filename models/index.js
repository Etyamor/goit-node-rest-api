import User from './User.js';
import Contact from './Contact.js';

// Define relationships
User.hasMany(Contact, {
  foreignKey: 'owner',
  as: 'contacts',
});

Contact.belongsTo(User, {
  foreignKey: 'owner',
  as: 'user',
});

export { User, Contact };

