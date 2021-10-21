# Apollo Server with Express and PostreSQL

## Built as part of R. Wieruch's The Road To GraphQL.

An Apollo Server implementation demostrating the following features (built on top of rwieruch's `minimal-node-application` setup): 
- Basic server setup using `apollo-server-express` package and Express middleware
- Basic type definitions and resolver functionality for a user chat app
- Demonstration of basic queries and mutations
- Schema stitching comes out-of-the-box with Apollo Server
- Setup database with `Postgresql` and `Sequelize` ORM. Implement basic models using Sequelize
- Validation and error support enhanced with Apollo Server `formatError` prop
- Token-based authentication with `jsonwebtoken` and Bcrypt
- Authorization; permissions and roles at resolver level. Resolver middleware functions using `graphql-resolvers` package
- Custom GraphQL scalars, e.g. `createdAt` field
- Pagination support; either a) offset/limit approach, or b) cursor/limit approach. Intermediate data layer for meta info: `MessageConnection`
- GraphQL Subscriptions, setup of Subscription Server using `graphql-subscriptions` and `subscriptions-transport-ws` packages
- Basic subscription and publishing functionality with PubSub (from `apollo-server`)
- E2E testing setup using mocha/chai and axios. TestDB setup
- Batching and Caching in GraphQL using `dataloader` for improved performance on heavy loads

## Installation

* `git clone git@github.com:laythq/apollo_server.git`
* `cd apollo_server`
* `npm install`
* `npm start`
* optional: include *.env* in your *.gitignore*
