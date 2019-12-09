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
        reviews: [Review!]!
    }
    
    input CreateReviewInput {
        authorId: ID!
        title: String!
        description: String!
    }
    
    type Review {
        id: ID!
        title: String!
        description: String!
        author: User! 
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

const resolvers = {
    Query: {
        users() {
            const usersWithReviews = users.map(user => {
                let userWithReviews = {};
                userWithReviews.id = user.id;
                userWithReviews.name = user.name;
                userWithReviews.birthDate = user.birthDate;
                if (user.reviewIds.length > 0) {
                    userWithReviews.reviews = user.reviewIds.map(
                        reviewId => {
                            return reviews.find(review => review.id === reviewId)
                        }
                    )
                } else {
                    userWithReviews.reviews = [];
                }
                return userWithReviews;
            });
            return usersWithReviews;
        },
        user(_, args) {
            return users.find(user => user.id === args.id);
        },
        reviews() {
            const reviewsWithUser = reviews.map(review => {
                let reviewWithUser = {};
                reviewWithUser.id = review.id;
                reviewWithUser.title = review.title;
                reviewWithUser.description = review.description;
                reviewWithUser.author = users.find(userId => review.authorId = userId);

                return reviewWithUser;
            });
            return reviewsWithUser;
        },
    },
    Mutation: {
        createUser: (parent, args) => {
            const user = {
                id: `${users.length + 1}`,
                name: args.name,
                birthDate: args.birthDate,
            };
            users.push(user);
            return user;
        },

        createReview: (parent, args) => {
            const user = users.find(user => user.id === args.authorId);
            const review = {
                id: `${reviews.length + 1}`,
                author: {
                    id: user.id,
                    name: user.name,
                    birthDate: user.birthDate
                },
                title: args.title,
                description: args.description
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

