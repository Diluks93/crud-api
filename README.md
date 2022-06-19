# Simple CRUD-API

## Instructions

  1. check node version `node -v` (should be >= 16.x)
  2. git clone https://github.com/Diluks93/crud-api.git
  3. git checkout develop
  4. cd crud-api
  5. npm install

## Usage

  1. `npm run start:dev` - to run in development mode
  2. open http://localhost:8626/api/users

ore

  1. `npm run start:prod` - to run in production mode
  2. open http://localhost:8626/api/users

## Description

This is app implement simple CRUD API using in-memory database underneath. 

### Used technologies
  No | Link to documentation | Description
  ---: | --- | ---
  -- | For development |
  1 | [dotenv](https://www.npmjs.com/package/dotenv) | To load environment variables from .env file
  2 | [eslint](https://www.npmjs.com/package/eslint) | To lint code
  3 | [prettier](https://www.npmjs.com/package/prettier) | To format code
  4 | [nodemon](https://www.npmjs.com/package/nodemon) | To run app in development mode and restart it when code changes
  5 | [typescript](https://www.npmjs.com/package/typescript) | To add type annotations to code
  6 | [ts-node](https://www.npmjs.com/package/ts-node) | To run typescript code
  7 | [webpack](https://www.npmjs.com/package/webpack) | To bundle code for production
  8 | [webpack-cli](https://www.npmjs.com/package/webpack-cli) | To run webpack
  9 | [ts-loader](https://www.npmjs.com/package/ts-loader) | To load typescript files in webpack
  10 | [uuid](https://www.npmjs.com/package/uuid) | To generate unique id
  -- | For test |
  11 | [jest](https://www.npmjs.com/package/jest) | To run tests
  12 | [ts-jest](https://www.npmjs.com/package/ts-jest) | To load typescript files in jest
  13 | [supertest](https://www.npmjs.com/package/supertest) | To test API

### Links

## `GET` 
- http://localhost:8626/api/users

  ---
  Server should return status code 200 and JSON with all users.
If you don't have any users, server should return empty array.
### **Example**:

GET | http://localhost:8626/api/users
--- | ---

| Status: | `200 OK` | Size: | `2 Bytes` | Time: | `15 ms` |

Response
___
```
[]
``` 

If you have some user, server should return array with users.

GET | http://localhost:8626/api/users
--- | ---

| Status: | `200 OK` | Size: | `103 Bytes` | Time: | `5 ms` |

Response
___

```
[
  {
    "id": "a73a706e-e9d1-4db9-b28a-22ff19bc0d16",
    "username": "Dimka",
    "age": 29,
    "hobbies": [
      "code programm"
    ]
  }
]
```

## `POST` 
- http://localhost:8626/api/users

  ---
  You have to send the request using JSON by setting the Content-Type to application/json. Your request body should contain the following fields: 
   - `username` as string and length 32 characters or less, 
   - `age` as number and less than 150 years old,
   - `hobbies` as array of strings ore empty array.
  
  Server should return status code 201 and JSON with new user.
### **Example**:

POST | http://localhost:8626/api/users
--- | ---
Body | Json

Json Content
```
{
  "username": "Dimka",
  "age": 29,
  "hobbies": [
    "code programm"
  ]
}
```

| Status: | `201 Created` | Size: | `66 Bytes` | Time: | `5 ms` |

Response
___
```
{
  "user": {
    "username": "Dimka",
    "age": 29,
    "hobbies": [
      "code programm"
    ]
  }
}
``` 

If you don't send the required fields, server should return status code 400 and JSON with error message.

| Status: | `400 Bad Request` | Size: | `44 Bytes` | Time: | `7 ms` |

Response
___
```
{
  "message": "${errorMessage}"
}
``` 

## `GET` 
- http://localhost:8626/api/users/:id

  ---
  Server should return status code 200 and JSON with user.
If you don't have user with this id, server should return status code 404 and JSON with error message. If you send invalid id, server should return status code 400 and JSON with error message
### **Example**:

GET | http://localhost:8626/api/users/a73a706e-e9d1-4db9-b28a-22ff19bc0d16
--- | ---

| Status: | `200 OK` | Size: | `101  Bytes` | Time: | `5 ms` |

Response
___
```
{
  "id": "a73a706e-e9d1-4db9-b28a-22ff19bc0d16",
  "username": "Dimka",
  "age": 29,
  "hobbies": [
    "code programm"
  ]
}
```

GET | http://localhost:8626/api/users/1
--- | ---

| Status: | `400 Bad Request` | Size: | `29  Bytes` | Time: | `5 ms` |

Response
___
```
{
  "message": "Invalid user id"
}
```

GET | http://localhost:8626/api/users/a73a706e-e9d1-4db9-b28a-22ff19bc0d17
--- | ---

| Status: | `404 Not Found` | Size: | `32  Bytes` | Time: | `7 ms` |

Response
___
```
{
  "message": "User doesn't exist"
}
```

## `PUT` 
- http://localhost:8626/api/users/:id

  ---
  You have to send the request using JSON by setting the Content-Type to application/json. Your request body can contain any fields from: 
  - `username` as string and length 32 characters or less, 
  - `age` as number and less than 150 years old,
  - `hobbies` as array of strings ore empty array.

  Server should return status code 200 and JSON with updated user. If you don't have user with this id, server should return status code 404 and JSON with error message. If you send invalid id, server should return status code 400 and JSON with error message

### **Example**:

PUT | http://localhost:8626/api/users/a73a706e-e9d1-4db9-b28a-22ff19bc0d17
--- | ---
Body | Json

Json Content
```
{
  "username": "Diluks93",
}
```

| Status: | `200 OK` | Size: | `60 Bytes` | Time: | `6 ms` |

Response
___
```
{
  "username": "Diluks93",
  "age": 29,
  "hobbies": [
    "code programm"
  ]
}
``` 
PUT | http://localhost:8626/api/users/1
--- | ---

| Status: | `400 Bad Request` | Size: | `29  Bytes` | Time: | `6 ms` |

Response
___
```
{
  "message": "Invalid user id"
}
```

PUT | http://localhost:8626/api/users/a73a706e-e9d1-4db9-b28a-22ff19bc0d18
--- | ---
Body | Json

Json Content
```
{
  "username": "Diluks93",
}
```

| Status: | `404 Not Found` | Size: | `32 Bytes` | Time: | `6 ms` |

Response
___
```
{
  "message": "User doesn't exist"
}
``` 

## `DELETE` 
- http://localhost:8626/api/users/:id

  ---
  Server should return status code 204 and JSON with deleted user. If you don't have user with this id, server should return status code 404 and JSON with error message. If you send invalid id, server should return status code 400 and JSON with error message

### **Example**:

  DELETE | http://localhost:8626/api/users/a73a706e-e9d1-4db9-b28a-22ff19bc0d17
  --- | ---

  | Status: | `204 No Content` | Size: | `0 Bytes` | Time: | `5 ms` |

  Response
  ___
  ```
  ```

  DELETE | http://localhost:8626/api/users/a73a706e-e9d1-4db9-b28a-22ff19bc0d18
  --- | ---

  | Status: | `404 Not Found` | Size: | `32 Bytes` | Time: | `7 ms` |

  Response
  ___
  ```
  {
    "message": "User doesn't exist"
  }
  ```

  DELETE | http://localhost:8626/api/users/1
  --- | ---

  | Status: | `400 Bad Request` | Size: | `29  Bytes` | Time: | `5 ms` |

  Response
  ___
  ```
  {
    "message": "Invalid user id"
  }
  ```

### Error Messages

  - Invalid user id
  - User doesn't exist
  - Something went wrong on the server
  - Missing required fields
  - Too many fields
  - Missing required field ${fieldName}
  - The username field must be a string
  - The username field must be less than 32 characters
  - The age field must be a number
  - The age field must be less than 150
  - The hobby field must be of type array of strings ore empty
  - No data sent


# Testing

  *1.* Run the tests with `npm run test`

  The first scenario
  ------------------
  1. Get all records with a `GET` `api/users` request (an empty array is expected)
  2. A new object is created by a `POST` `api/users` request (a response containing newly created record is expected)
  3. With a `GET` `api/user/{userId}` request, we try to get the created  record by its `id` (the created record is expected)
  4. We try to update the created record with a `PUT` `api/users/{userId}`request (a response is expected containing an updated object with the same `id`)
  5. With a `DELETE` `api/users/{userId}` request, we delete the created object by `id` (confirmation of successful deletion is expected)
  6. With a `GET` `api/users/{userId}` request, we are trying to get a deleted object by `id` (expected answer is that there is no such object)

  The second scenario
  -------------------
  1. A new object doesn't created a `POST` `api/users` request, because body send has too many fields
  2. With a `GET` `api/users` request, we are trying to get all records (expected answer is an empty array)
  3. A new object is created by a `POST` `api/users` request (a response containing newly created record is expected)
  4. With a `GET` `api/user/1` request, we try to get the created  record by its invalid id (expected answer is an error message) 
  5. With a `GET` `api/user/${validUserId}` request, we try to get the created  record by its valid id (expected answer is an error message)
  6. With a `DELETE` `api/users/{validUserId}` request, we don't delete object by `id` (expected answer is an error message)
  7. With a `GET` `api/users` request, we are trying to get all records (expected answer is array length 1)

  The third scenario
  -------------------
  1. A new object doesn't created a `POST` `api/users` request, because body send doesn't have required fields
  2. With a `GET` `api/users` request, we are trying to get all records (expected answer is an empty array)
  3. A new object is created by a `POST` `api/users` request (a response containing newly created record is expected)
  4. We try to update the created record with a `PUT` `api/users/{userId}`request send wrong required fields (expected answer is an error message)
  5. We try to update the created record with a `PUT` `api/users/{userId}`request send wrong body (expected answer is an error message)

*2.* Run the test with `npm run test -- --coverage`

```
 PASS  src/__test__/secondScenario.spec.ts
 PASS  src/__test__/thirdScenario.spec.ts
 PASS  src/__test__/firstScenario.spec.ts
--------------------|---------|----------|---------|---------|----------------------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|----------------------------------
All files           |   92.89 |    91.17 |   94.73 |   92.61 |                                  
 src                |   87.09 |    95.45 |   66.66 |   86.66 |                                  
  server.ts         |   87.09 |    95.45 |   66.66 |   86.66 | 17-18,21-22                      
 src/controllers    |    92.8 |    88.63 |     100 |   92.62 |                                  
  appError.ts       |     100 |       50 |     100 |     100 | 7                                
  userController.ts |   92.56 |    90.47 |     100 |   92.37 | 22,96-97,101,134-135,142,180,200
 src/models         |     100 |      100 |     100 |     100 | 
  userModel.ts      |     100 |      100 |     100 |     100 | 
--------------------|---------|----------|---------|---------|----------------------------------

Test Suites: 3 passed, 3 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        4.306 s
Ran all test suites.
```
