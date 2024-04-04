## Description

Payever Assignment for the role fo backend web engineer. This application does following tasks:

* User Creation: Create a new user entry in the database. Upon creation, an email and RabbitMQ event are sent (dummy sending).
* User Retrieval: Retrieve user data from an external API (https://reqres.in/api/users/{userId}) and return it in JSON representation.
* User Avatar Handling:
* Avatar Retrieval: Retrieve user avatar image by the avatar URL. On the first request, the image is saved as a plain file and stored in MongoDB with userId and hash. Return its base64-encoded representation. On subsequent requests, return the previously saved file in base64-encoded representation (retrieve from the database).
* Avatar Deletion: Remove the avatar file from the file system storage and delete the stored entry from the database.

## Routes

* POST /api/users: Create a new user entry.
* GET /api/user/{userId}: Retrieve user data by userId.
*GET /api/user/{userId}/avatar: Retrieve user avatar image by userId.
* DELETE /api/user/{userId}/avatar: Remove the user avatar.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
