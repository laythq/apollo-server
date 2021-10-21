import Sequelize, { DataTypes } from 'sequelize';
import user from './user';
import message from './message';

const sequelize = new Sequelize(
    process.env.TEST_DATABASE || process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    { dialect: 'postgres' },
);

// const User = user(sequelize, DataTypes);
// const Message = message(sequelize, DataTypes);


const models = {
  User: user(sequelize, DataTypes),
  Message: message(sequelize, DataTypes),
};

// User.hasMany(Message, {
//   onDelete: 'CASCADE',
// });

// Message.belongsTo(User);

// const models = {
//   User,
//   Message,
// };

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
