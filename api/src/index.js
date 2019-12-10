import { GraphQLServer } from 'graphql-yoga';

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
        type: UserType!
        reviews: [Review!]!
    }
    
    type Review {
        id: ID!
        title: String!
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

// these would normally be fetched from a database
const users = [
    {
        id: "0",
        name: "Mary",
        birthDate: "2000-12-10",
        type: "SUPERUSER",
        reviewIds: []
    },
    {
        id: "1",
        name: "Tom",
        birthDate: "1990-06-23",
        type: "OPERATOR",
        reviewIds: ["0", "1"]
    }
];

const reviews = [
    {
        id: "0",
        authorId: "1",
        title: "good",
        description: "this is a fake review"
    },
    {
        id: "1",
        authorId: "1",
        title: "meh",
        description: "2 stars"
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
    },

    User: {
        reviews(user) {
            return getReviewsById(user.reviewIds);
        }
    },

    Review: {
        author(review) {
            return getAuthorById(review.authorId);
        }
    },



    Mutation: {
        createUser: (parent, args) => {
            const user = {
                id: `${users.length}`,
                name: args.userInput.name,
                birthDate: args.userInput.birthDate,
                type: args.userInput.type,
                reviewIds: []
            };
            users.push(user);
            return user;
        },

        createReview: (parent, args) => {
            const user = users.find(currentUser => currentUser.id === args.reviewInput.authorId);
            user.reviewIds.push(reviews.length.toString());
            const review = {
                id: `${reviews.length}`,
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

