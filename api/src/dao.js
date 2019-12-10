// these would normally be fetched from a database
export const users = [
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

export const reviews = [
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

export const getReviewsById = (reviewIds) => {
    return reviewIds.map(reviewId => reviews.find(review => review.id === reviewId));
};

export const getUsersWithReviews = () => {
    return users;
};

export const getUserById = (authorId) => {
    return users.find(user => authorId === user.id);
};

export const getReviewsWithUser = () => {
    return reviews;
};

export const createUser = (args) => {
    const user = {
        id: `${users.length}`,
        name: args.userInput.name,
        birthDate: args.userInput.birthDate,
        type: args.userInput.type,
        reviewIds: []
    };
    users.push(user);
    return user;
};

export const createReview = (args) => {
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
};
