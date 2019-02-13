import {buildSchema} from "graphql";

export const schema = buildSchema(`

  input UserInput {
    name: String
    email: String
  } 
    
  type User {
    id: Int
    name: String
    email: String
  }
  
  type Query {    
    user(id: Int!): User
    users: [User]  
    timeoutServer(interval: Int!): String 
    serverName: String
  }
  
  type Mutation {
    createUser(input: UserInput): User
    updateUser(id: Int!, input: UserInput): User    
  }
  
  `);
