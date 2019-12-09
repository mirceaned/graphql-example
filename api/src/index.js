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

const users = [
    {
        id: "0",
        name: "Mary",
        birthDate: "2000-12-10",
    },
    {
        id: "1",
        name: "Tom",
        birthDate: "1990-06-23",
    }
];

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
                id: `${users.length+1}`,
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

