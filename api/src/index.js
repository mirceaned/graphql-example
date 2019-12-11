import { GraphQLServer } from 'graphql-yoga';
import { getReviewsById, getUsersWithReviews, getUserById, getReviewsWithUser, createUser, createReview } from './dao';

const typeDefs = `
    type Query {
        users: [User!]!
        user(id: ID!): User
        reviews: [Review!]!
        review(id: ID!): Review
    }
    
    # User in the ACME system
    type User { 
        id: ID!
        name: String!
        birthDate: String
        type: UserType!
        reviews: [Review!]!
    }
    
    type Review {
        id: ID! 
        title: String! @deprecated
        description: String!
        author: User! 
    }
     
    enum UserType {
      SUPERUSER
      OPERATOR
    }
   
   
    type Mutation {
        createUser(userInput: CreateUserInput!): CreateUserResponse!
        createReview(reviewInput: CreateReviewInput!): CreateReviewResponse!
    }
    
    input CreateUserInput {
        name: String!
        birthDate: String
        type: UserType!
    }
    
    type CreateUserResponse {
        id: ID!
        name: String!
        birthDate: String
        type: UserType!
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

const resolvers = {
    Query: {
        users() {
            return getUsersWithReviews();
        },
        user(_, args) {
            return getUserById(args);
        },
        reviews() {
            return getReviewsWithUser();
        },
    },

    User: {
        reviews(user) {
            return getReviewsById(user.reviewIds);
        }
    },

    Review: {
        author(review) {
            return getUserById(review.authorId);
        }
    },



    Mutation: {
        createUser: (parent, args) => {
            return createUser(args);
        },

        createReview: (parent, args) => {
            return createReview(args);
        }
    },
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log("GraphQL server is running on http://localhost:4000"));

