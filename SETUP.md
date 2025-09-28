# Setup Instructions

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Secret (change this in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=4000
```

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Generate Prisma client:

```bash
pnpm db:generate
```

3. Run database migrations:

```bash
pnpm db:migrate
```

4. Start the development server:

```bash
pnpm dev
```

## GraphQL Playground

Once the server is running, you can access the GraphQL playground at:
http://localhost:4000/graphiql

## Available Endpoints

### Queries

- `users` - Get all users
- `user(id: Int!)` - Get user by ID
- `me` - Get current authenticated user

### Mutations

- `createUser(input: CreateUserInput!)` - Create a new user
- `updateUser(id: Int!, input: UpdateUserInput!)` - Update user
- `deleteUser(id: Int!)` - Delete user
- `register(input: CreateUserInput!)` - Register new user with authentication
- `login(input: LoginInput!)` - Login user
- `logout` - Logout user

## Authentication

The API uses JWT tokens for authentication. Include the token in the
Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Example Queries

### Register a new user

```graphql
mutation {
  register(
    input: {
      name: "John Doe"
      type: NATURAL
      email: "john@example.com"
      password: "password123"
    }
  ) {
    token
    user {
      id
      name
      type
      email
    }
  }
}
```

### Login

```graphql
mutation {
  login(input: { email: "john@example.com", password: "password123" }) {
    token
    user {
      id
      name
      type
    }
  }
}
```

### Get current user (requires authentication)

```graphql
query {
  me {
    id
    name
    type
    email
  }
}
```
