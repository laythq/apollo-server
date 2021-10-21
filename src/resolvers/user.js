import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAdmin } from './auth';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign(
      {
        id, email, username, role,
      },
      secret,
      { expiresIn },
  );
};

const resolvers = {
  Query: {
    me: async (parent, args, { me, models }) => {
      return await models.User.findByPk(me.id);
    },
    user: (parent, { id }, { models }) => {
      return models.User.findByPk(id);
    },
    users: async (_, args, { models }) => {
      return await models.User.findAll();
    },
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },

  Mutation: {
    signUp: async (
        parent,
        { username, email, password },
        { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return {
        token: createToken(user, secret, '30m'),
      };
    },

    signIn: async (
        parent,
        { login, password },
        { models, secret },
    ) => {
      console.log(models.User);

      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
            'No user found with these login credentials',
        );
      }

      const isValid = await user.validatePassword(login, password);

      if (!isValid) {
        throw new AuthenticationError(
            'Invalid password.',
        );
      }

      return {
        token: createToken(user, secret, '30m'),
      };
    },

    deleteUser: combineResolvers(
        isAdmin,
        async (parent, { id }, { models }) => {
          return await models.User.destroy({
            where: { id },
          });
        }),
  },
};

export default resolvers;
