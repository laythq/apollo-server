import 'dotenv/config';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import jwt from 'jsonwebtoken';
import http from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import DataLoader from 'dataloader';
import loaders from './loaders';


const isTest = !!process.env.TEST_DATABASE;

const createUsersWithMessages = async (date) => {
  await models.User.create(
      {
        username: 'Layth',
        messages: [
          {
            text: 'Published the Road to learn React',
            createdAt: date.setSeconds(date.getSeconds() + 1),
          },
        ],
        email: 'layth@layth.com',
        password: 'laythpassword',
        role: 'ADMIN',
      },
      {
        include: [models.Message],
      },
  );

  await models.User.create(
      {
        username: 'ddavids',
        messages: [
          {
            text: 'Happy to release ...',
            createdAt: date.setSeconds(date.getSeconds() + 1),
          },
          {
            text: 'Published a complete ...',
            createdAt: date.setSeconds(date.getSeconds() + 1),
          },
        ],
        email: 'daveyboy@dave.com',
        password: 'davepassword',

      },
      {
        include: [models.Message],
      },
  );
};

const getMe = async (req) => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (error) {
      throw new AuthenticationError(
          'Your session expired, sign in again',
      );
    }
  }
};


// eslint-disable-next-line require-jsdoc
(async () => {
  const app = express();
  const newSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers,
  });

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ( { req, connection } ) => {
      if (connection) {
        return {
          models,
          loaders: {
            user: new DataLoader((keys) =>
              loaders.user.batchUsers(keys, models)),
          },
        };
      }

      if (req) {
        const me = await getMe(req);
        return {
          models,
          me,
          secret: process.env.SECRET,
          loaders: {
            user: new DataLoader((keys) =>
              loaders.user.batchUsers(keys, models)),
          },
        };
      }
    },
    formatError: (error) => {
      const message = error.message
          .replace('SequelizeValidationError: ', '')
          .replace('Validation error: ', '');

      return {
        ...error,
        message,
      };
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async ApolloServerPluginDrainHttpServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  const httpServer = http.createServer(app);

  const subscriptionServer = SubscriptionServer.create({
    schema: newSchema,
    execute,
    subscribe,
  }, {
    server: httpServer,
    path: server.graphqlPath,
  });

  await server.start();

  server.applyMiddleware({
    app, path: '/graphql',
  });


  sequelize
      .sync({
        force: isTest,
      })
      .then(async () => {
        if (isTest) {
          createUsersWithMessages(new Date());
        }
      })
      .then(async () => {
        try {
          await sequelize.authenticate();
          console.log('Connection Successful');
        } catch (error) {
          console.log('Unable to Connect');
        }
      })
      .then(() => httpServer.listen(8000, () => console.log('ready')))
      .then(() => console.log('server ready'));
})();

