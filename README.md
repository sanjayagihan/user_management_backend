# User Management API

This is a simple backend API built with **Express.js** for managing users. It provides functionality for authentication, creating, updating, retrieving, and deleting users. The API uses **JWT** for authentication and **bcryptjs** for password hashing.

## Features

- **User Authentication**: Users can log in using their username and password, which are verified against stored credentials. JWT tokens are used for authentication.
- **User Management**: Admin users can add, update, retrieve, and delete regular users.
- **Password Security**: Passwords are hashed using bcryptjs to ensure secure storage.

## Technologies Used

- **Node.js**: JavaScript runtime used for the backend.
- **Express.js**: Web framework for building the API.
- **JWT**: JSON Web Tokens for secure user authentication.
- **bcryptjs**: Library for hashing passwords.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/user-management-api.git
   cd user-management-api

2. Install dependencies:
   ```bash
   npm install

3. run the server:
   ```bash
   npm start

## API Tests

Test cases:

1. **Create User**:
   - **Test**: Ensures that a new user can be successfully created by sending a `POST` request to the `/users` endpoint with the required fields (`firstName` and `lastName`).
   - **Validation**: Verifies that the user is created with the correct properties, including an auto-generated `id`.

2. **Create User with Missing Fields**:
   - **Test**: Verifies that a `400` error is returned when attempting to create a user with missing required fields (e.g., only `firstName` is provided).
   - **Validation**: Ensures the API responds with a `400` status and the appropriate error message.

3. **Update User**:
   - **Test**: Confirms that an existing user's details can be updated successfully by sending a `PUT` request to the `/users/:id` endpoint.
   - **Validation**: Verifies that the user's updated information is reflected in the response.

4. **Update User with Invalid ID**:
   - **Test**: Ensures that a `404` error is returned when attempting to update a user with an invalid `id`.
   - **Validation**: Ensures the API responds with a `404` status and the correct error message (`"User not found"`).

### Running the Tests

1. Install dependencies:
   ```bash
   npm install

1. Run the tests:
   ```bash
   npm test
