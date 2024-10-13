# Car Rental Reservation System [Live](https://car-rental-reservation-system-backend.vercel.app/)

<p style="color: red; font-weight: bold;">
    <strong>Note:</strong> Use the following credentials to access the admin and user features:
</p>
<ul style="color: black;">
    <li><strong>Admin Credentials:</strong></li>
    <ul>
        <li><strong>Email:</strong> admin@one.com</li>
        <li><strong>Password:</strong> admin123</li>
    </ul>
    <li><strong>User Credentials:</strong></li>
    <ul>
        <li><strong>Email:</strong> user@one.com</li>
        <li><strong>Password:</strong> user123</li>
    </ul>
</ul>

Our Car Rental Reservation System streamlines the entire vehicle booking and rental process, allowing customers to easily reserve cars tailored to their needs. With our intuitive and user-friendly interface, customers can book a vehicle without any hassle, ensuring a seamless experience from start to finish.

## Table of Contents

-   [Prerequisites](#prerequisites)
-   [Technology](#technology)
-   [Installation](#installation)
-   [Features](#features)
-   [Usage](#usage)
-   [License](#license)
-   [Contact](#contact)

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   **[Node.js](https://nodejs.org/)** (version >= 20.11.1)
-   **[npm](https://www.npmjs.com/)** (version >= 9.8.0)
-   **[TypeScript](https://www.typescriptlang.org/)** (version >= 5.4.5)

You will also need a MongoDB database setup. You can follow the instructions [here](https://docs.mongodb.com/manual/installation/) to install MongoDB.

## Technology

This project uses the following technologies:

-   **[express](https://www.npmjs.com/package/express)** : A web framework for Node.js.
-   **[mongoose](https://www.npmjs.com/package/mongoose)** : An Object Data Modeling (ODM) library for MongoDB and Node.js.
-   **[zod](https://www.npmjs.com/package/zod)** : A TypeScript-first schema declaration and validation library.
-   **[cors](https://www.npmjs.com/package/cors)** : A middleware to enable Cross-Origin Resource Sharing.
-   **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** : A library to sign, verify and decode JSON Web Tokens.
-   **[bcrypt](https://www.npmjs.com/package/bcrypt)** : A library to help hash passwords.
-   **[cookie-parser](https://www.npmjs.com/package/cookie-parser)** : A middleware to parse cookies attached to the client request object.
-   **[dotenv](https://www.npmjs.com/package/dotenv)** : A module to load environment variables from a .env file.
-   **[http-status](https://www.npmjs.com/package/http-status)** : A utility to interact with HTTP status codes.

## Installation

Instructions on how to install the project.

```sh
# Clone the repository
git clone https://github.com/MehediHaassan1/Car-Rental-Reservation-System-Backend.git

# Navigate to the project directory
cd project-name

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Update .env file with your configuration

# Start the project
npm run start:dev
```

## .env.example
### Have a look at the .env.example file. And make sure that the environment variable is set correctly. 

## Features

-   **Login & Registration:** Secure signup, login, JWT tokens, two user roles (User/Admin).
-   **Profile Management:** Update profiles, follow others, badges for verified users.
-   **Admin Controls:** Manage users, posts, payments; block/unblock users.
-   **Post Creation:** Rich Text Editor, attach images, categorize posts (Web, AI, etc.), premium posts.
-   **Comments & Reactions:** Upvote/downvote posts, comment with edit/delete options and like or dislike posts.
-   **Search, Filter & pagination:** Search tips, filter by categories and paginate.
-   **Follow System:** Follow users to get updates on their content.
-   **Payment Processing:** Pay for premium features with aamarpay and view payment history.
-   **Analytics:** Admin and user-specific insights.

# License

# Routes

### Authentication

-   **POST** `/api/v1/auth/register` - Register a new user.
-   **POST** `/api/v1/auth/login` - Login and receive a JWT & refresh token.
-   **POST** `/api/v1/auth/change-password` - Change old password.
-   **POST** `/api/v1/auth/refresh-token` - Help to convert regenerate the access token

### Users

-   **GET** `/api/v1/users` - Get all users data (Admin only).
-   **GET** `/api/v1/users/:id` - Get single users data (Admin only).
-   **GET** `/api/v1/users/get-me` - Get logged in users data
-   **PUT** `/api/v1/users/update-profile` - Update logged-in user's profile.
-   **PUT** `/api/v1/users/:userId/follow-toggle` - Follow and unfollow the user.
-   **PATCH** `/api/v1/users/:userId/status` - Update user's status active or block (Admin only).
-   **DELETE** `/api/v1/users/:userId` - Delete Single user (Admin only).

### Posts

-   **POST** `/api/v1/posts` - Create a post.
-   **GET** `/api/v1/posts` - Get a list of all posts.
-   **GET** `/api/v1/posts/:postId` - Get a list of single post.
-   **GET** `/api/v1/posts/my-posts` - Get a list of my posts.
-   **PUT** `/api/v1/posts/:postId` - Update a post by user.
-   **DELETE** `/api/v1/posts/:postId` - Delete a post by user & admin also.

-   **POST** `/api/v1/posts/post-comment/:postId` - Make a comment for the post.
-   **DELETE** `/api/v1/posts/delete-comment/:postId/:commentId` - Delete the comment, that post by user.
-   **PUT** `/api/v1/posts/update-comment/:postId/:commentId` - Update the comment, that post by user.
-   **PUT** `/api/v1/posts/:postId/vote` - React on the post, that post by user.

### Payments

-   **POST** `/api/v1/payment/create-payment` - Create a payment according to the plan.
-   **POST** `/api/v1/payment/confirmation` - Make sure the payment is success or fail.
-   **GET** `/api/v1/payment` - Get all the payment history (Admin only).
-   **GET** `/api/v1/payment/my-payment-history` - Get all the payment history (User only).

### Analytics

-   **GET** `/api/v1/analytics` - Get the analytics like total users, total posts, active user, total revenue and so on (Admin only).
-   **GET** `/api/v1/analytics/user-analytics` - Get the analytics like total amount of payments, total posts, total followers, total following and so on (User only).


[MIT](https://choosealicense.com/licenses/mit/)

# Contact

If you have any questions, feedback, or issues, feel free to contact us:

-   **Email:** mehedi.haassan1@gmail.com
