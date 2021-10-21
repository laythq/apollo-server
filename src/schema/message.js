import { gql } from 'apollo-server-express';

const schema = gql`
  extend type Query {
    messages(cursor: String, limit: Int): MessageConnection!
    message(id: ID!): Message! 
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type MessageCreated {
    message: Message!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }
`;

export default schema;
