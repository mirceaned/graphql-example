const { GraphQLServer } = require('graphql-yoga');

// todo - add enum for user type
const typeDefs = `
    type Query {
        users: [User!]!
        user(id: ID!): User
        reviews: [Review!]!
        review(id: ID!): Review
    }
    
   type User {
        id: ID!
        name: String!
        birthDate: String
        reviews: [Review!]!
    }
   
   type Review {
        id: ID!
        title: String!
        description: String!
        author: User! 
    }
     
   
   
    type Mutation {
        createUser(userInput: CreateUserInput!): CreateUserResponse!
        createReview(reviewInput: CreateReviewInput!): CreateReviewResponse!
    }
    
    input CreateUserInput {
        name: String!
        birthDate: String
    }
    
    type CreateUserResponse {
        id: ID!
        name: String!
        birthDate: String
    }
    
    input CreateReviewInput {
        authorId: ID!
        title: String!
        description: String!
    }
    
    type CreateReviewResponse {
        id: ID!
        authorId: ID!
        title: String!
        description: String!
    }
`;

// these would normally be fetched from a database
const users = [
    {
        id: "0",
        name: "Mary",
        birthDate: "2000-12-10",
        reviewIds: []
    },
    {
        id: "1",
        name: "Tom",
        birthDate: "1990-06-23",
        reviewIds: ["0", "1"]
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

function getReviewsById(reviewIds) {
    return reviewIds.map(reviewId => reviews.find(review => review.id === reviewId));
}

function getUsersWithReviews() {
    return users;
}

function getAuthorById(authorId) {
    return users.find(user => authorId === user.id);
}

function getReviewsWithUser() {
    return reviews;
}

const resolvers = {
    Query: {
        users() {
            return getUsersWithReviews();
        },
        user(_, args) {
            return users.find(user => user.id === args.id);
        },
        reviews() {
            return getReviewsWithUser();
        },
        review(_, args) {
            return reviews.find(review => review.id === args.id);
        },
    },

    User: {
        reviews(user) {
            return getReviewsById(user.reviewIds);
        }
    },

    Review: {
        author(review) {
            return getAuthorById(review.author.id);
        }
    },

    Mutation: {
        createUser: (parent, args) => {
            const user = {
                id: `${users.length + 1}`,
                name: args.userInput.name,
                birthDate: args.userInput.birthDate,
                reviews: []
            };
            users.push(user);
            return user;
        },

        createReview: (parent, args) => {
            const user = users.find(user => user.id === args.reviewInput.authorId);
            const review = {
                id: `${reviews.length + 1}`,
                authorId: user.id,
                title: args.reviewInput.title,
                description: args.reviewInput.description
            };
            reviews.push(review);
            return review;
        }
    },
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log("GraphQL server is running on http://localhost:4000"));

