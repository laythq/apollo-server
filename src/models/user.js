import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
    role: {
      type: DataTypes.STRING,
    },
  });


  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async (login) => {
    const user = await User.findOne({
      where: {
        username: login,
      },
    });

    if (!user) {
      user = await User.findOne({
        where: {
          email: login,
        },
      });
    }


    return user;
  };

  User.beforeCreate(async (user) => {
    console.log('-----USER', user.password);
    user.password = await user.generatePasswordHash(user.password);
  });

  User.prototype.generatePasswordHash = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  User.prototype.validatePassword = async (login, password) => {
    const user = await User.findOne({
      where: {
        username: login,
      },
    });

    console.log('------HASH', user.password);
    return await bcrypt.compare(password, user.password);
  };

  return User;
};

export default user;
