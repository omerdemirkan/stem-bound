<p align="center">
  <img src="/public/assets/stem-bound-logo.png" alt="Logo">
</p>

# Stem-bound API V1

The REST API behind **Stem-bound**, a platform that connects professionals in STEM fields with schools in need to teach courses on in demand skills.

## Documentation

### Headers

```javascript
authorization: "Bearer <access_token>";
```

_Required for some routes. Failure to send this header for authenticated routes will result in a 401 response_

### Terminology

Role: the type of user.
Valid roles (Case sensitive):

1. STUDENT

2. SCHOOL_OFFICIAL

3. INSTRUCTOR

### Authentication Routes

**POST**
`/api/v1/auth/sign-up?role=<ROLE>`

_Send user info in request body appropriate to the user's role including the password. This password will be used to create a hash and promptly deleted. This route will return the newly created user object and an access token._

**POST**
`/api/v1/auth/log-in?role=<ROLE>`

_Send user email and password in request body. If successful, this route will return the user object and an access token, otherwise it will return a 403 status code._

**GET**
`/api/v1/auth/me`

_Auth required. This route extracts and sends the token sent in the authentication header and sends a token with an updated expiration date. If the token is invalid or expired, this route returns a 403 status._

### School routes

**GET**
`/api/v1/school?lat=<latitude>&long=<longitude>&skip=<num-skipped>&limit=<num-schools>`

_latitude and longitude allows for sorting by distance. limit and skip values offer pagination functionality on the client._

**GET**
`/api/v1/school/:ObjectId`

**POST**
`/api/v1/school/refresh-database`

_Refreshes the school database. Takes in optional url in the request body for the school csv source. Requires not only valid token, but a ADMIN role in the access token payload._

### User Routes

**GET**
`/api/v1/user?role=<USER_ROLE>`

**GET**
`/api/v1/user/:ObjectId?role=<USER_ROLE>`

**PATCH**
`/api/v1/user/:ObjectId?role=<USER_ROLE>`

_Auth required, param id must match with that in the access-token payload_

**DELETE**
`/api/v1/user/:ObjectId?role=<USER_ROLE>`

_Auth required, param id must match with that in the access-token payload_

### Course routes

**GET**
`/api/v1/course`

**GET**
`/api/v1/course/:ObjectId`

**GET**
`/api/v1/course/:ObjectId/instructors`

**GET**
`/api/v1/course/:ObjectId/students`

**GET**
`/api/v1/course/:ObjectId/school`

**POST**
`/api/v1/course/:ObjectId`
_Auth required, payload user role must be INSTRUCTOR, payload user id must be included in course instructor metadata_

**POST**
`/api/v1/course/:ObjectId/enroll`
_Auth required, payload user role must be STUDENT_

**POST**
`/api/v1/course/:ObjectId/drop`
_Auth required, payload user role must be STUDENT_

**PATCH**
`/api/v1/course/:ObjectId`
_Auth required, payload user role must be INSTRUCTOR, payload user id must be included in course instructor metadata_

**DELETE**
`/api/v1/course/:ObjectId`
_Auth required, payload user role must be INSTRUCTOR, payload user id must be included in course instructor metadata_
