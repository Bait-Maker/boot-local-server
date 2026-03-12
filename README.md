# boot-local-server

Webserver project designed to get familiar working with express, HTTP requests, and REST API implementation.

The web server is simulating a "twitter like" service where users are able to create an account and post "chirps"

I'm using a Postgres for the backend

## Usage 🚀

### `POST` /api/users

Create new user with email and password

#### request body:

```json
{
  "email": "jimbo@yahoo.com",
  "password": "12345"
}
```

#### Response body:

```json
{
  "id": "27e8fe5f-3591-4008-b64c-899820185009",
  "createdAt": "2026-03-12T11:53:08.699Z",
  "updatedAt": "2026-03-12T11:53:08.699Z",
  "email": "jimbo@yahoo.com",
  "isChirpyRed": false
}
```

### `POST` /api/login

Login with a created email and password. Generates a access and refreshToken.

#### Request Body:

```json
{
  "email": "jimbo@yahoo.com",
  "password": "12345"
}
```

#### Response Body:

```json
{
  "id": "27e8fe5f-3591-4008-b64c-899820185009",
  "createdAt": "2026-03-12T11:53:08.699Z",
  "updatedAt": "2026-03-12T11:53:08.699Z",
  "email": "jimbo@yahoo.com",
  "isChirpyRed": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGlycHkiLCJzdWIiOiIyN2U4ZmU1Zi0zNTkxLTQwMDgtYjY0Yy04OTk4MjAxODUwMDkiLCJpYXQiOjE3NzMzMzQ0NTQsImV4cCI6MTc3MzMzODA1NH0.QijBnkwi74eo9LPldZhBOq14or5JX9n5V_Cgi0GL2cI",
  "refreshToken": "b793401136718e243467177eeb2592b57e1dc6150294b951cbd6274fe61d2c44"
}
```

### `POST` /api/chirps

Create a chirp to post. The users access token needs to be in the "Authorization" field in the headers.

ex: Key: `Authorization` Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGlycHkiLCJzdWIiOiIyN2U4ZmU1Zi0zNTkxLTQwMDgtYjY0Yy04OTk4MjAxODUwMDkiLCJpYXQiOjE3NzMzMzQ0NTQsImV4cCI6MTc3MzMzODA1NH0.QijBnkwi74eo9LPldZhBOq14or5JX9n5V_Cgi0GL2cI`

#### Request Body:

```json
{
  "body": "Not sure what to wear for Halloween"
}
```

#### Response body:

```json
{
  "id": "cd201ebf-69d1-4af3-b0b1-29183bcea89c",
  "createdAt": "2026-03-12T11:55:34.614Z",
  "updatedAt": "2026-03-12T11:55:34.614Z",
  "body": "Not sure what to wear for Halloween",
  "userId": "27e8fe5f-3591-4008-b64c-899820185009"
}
```

### `GET` /api/chirps

Retrieve all chirps on the database.

### `GET` /api/chirps?authorId=1

Retrieve all chirps for the specific id provided

### `GET` /api/chirps?sort=desc

Sort the chirps in descending order (ascending order is set by default)

### `POST` /api/refresh

Generate a new JWT access token for the user.
Needs the refresh token in the Authorization field in HTTP headers

ex: Key `Authorization` Value: `bearer b793401136718e243467177eeb2592b57e1dc6150294b951cbd6274fe61d2c44`

### `POST` /api/revoke

Revoke a users refresh token.

ex: Key `Authorization` Value: `bearer b793401136718e243467177eeb2592b57e1dc6150294b951cbd6274fe61d2c44`

### `DELETE` /api/chirps/${chirpId}

Delete the chirp with the id provided in the endpoint

#### Response -> 204

### `PUT` /api/users

Update an existing users email and password

### Request Body:

```json
{
  "email": "jimbo@gmail.com",
  "password": "different-password"
}
```

### Response Body:

status: `200`

```json
{
  "id": "26226f18-648c-4e1b-aaaf-c40696c3fae2",
  "createdAt": "2026-03-10T15:36:20.066Z",
  "updatedAt": "2026-03-10T20:38:25.287Z",
  "email": "jimbo@gmail.com"
}
```

### `POST` /api/polka/webhooks

Upgrade user to Chirpy Red member

#### Request Body:

status: `200`

```json
{
  "event": "user.upgraded",
  "data": {
    "userId": "7e416f95-9506-4205-a480-91763f60bc2d"
  }
}
```

#### Response status `204`
