export const userSchema = `
  type User {
    id: Int!
    name: String!
    type: UserType!
    createdAt: String!
    updatedAt: String!
    auth: Auth
  }

  type Auth {
    id: Int!
    email: String!
    createdAt: String!
    updatedAt: String!
    user: User
  }

  enum UserType {
    NATURAL
    LEGAL
  }

  input CreateUserInput {
    name: String!
    type: UserType!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    type: UserType
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
    me: User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: Int!, input: UpdateUserInput!): User!
    deleteUser(id: Int!): User!
    register(input: CreateUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: Boolean!
  }
`;
