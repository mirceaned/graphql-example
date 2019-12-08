const { GraphQLServer } = require('graphql-yoga');

// todo - add enum for user type
// todo - add second type and use it inside user
const typeDefs = `
    type Query {
        users: [User!]!
        user(id: ID!): User
    }
    
    type Mutation {
        createUser(name: String!, birthDate: String): User!
    }
    
    type User {
        id: ID!
        name: String!
        birthDate: String
    }
`;

// todo - add mutation for create user
const resolvers = {
    Query: {
        users() {
            return users;
        },
        user(_, args) {
            return users.find(user => user.id === args.id);
        }
    },
    Mutation: {
        createUser: (parent, args) => {
            const user = {
                id: 1,
                name: args.name,
                birthDate: args.birthDate
            };
            users.push(user);
            return user;
        }
    },
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log("GraphQL server is running on http://localhost:4000"));

const users = [
    {
        id: "1",
        name: "Ada Lovelace",
        birthDate: "1815-12-10",
        username: "@ada"
    },
    {
        id: "2",
        name: "Alan Turing",
        birthDate: "1912-06-23",
        username: "@complete"
    }
];
