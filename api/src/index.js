const { GraphQLServer } = require('graphql-yoga');

// todo - add enum for user type
const typeDefs = `
    type Query {
        users: [User!]!
        user(id: ID!): User
        reviews: [Review!]!
    }
    
    type Mutation {
        createUser(userInput: CreateUserInput!): User!
        createReview(reviewInput: CreateReviewInput!): Review!
    }
    
    input CreateUserInput {
        name: String!
        birthDate: String
    }
    
    type User {
        id: ID!
        name: String!
        birthDate: String
        dodo: String
        reviews: [Review!]!
    }
    
    input CreateReviewInput {
        author: String! 
        title: String!
        description: String!
    }
    
    type Review {
        id: ID!
        authorId: ID!
        author: User! 
        title: String!
        description: String!
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

const reviews = [
    {
        id: "0",
        authorId: "1",
        title: "good",
        description: "fake review"
    },
    {
        id: "1",
        authorId: "1",
        title: "meh",
        description: "1 star"
    }
];

const resolvers = {
    Query: {
        users() {
            return users;
        },
        user(_, args) {
            return users.find(user => user.id === args.id);
        },
        reviews() {
            return reviews;
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
        },

        createReview: (parent, args) => {
            const review = {
                id: `${reviews.length+1}`,
                title: args.title,
                description: args.description
            };
            reviwws.push(review);
            return review;
        }
    },
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log("GraphQL server is running on http://localhost:4000"));

