## space X odyssey

## Dependencies & Technologies

- Node v12.5.0
- npm 6.14.4
- postgres (PostgreSQL) 11.3

### Before you can start the local environment

- Install [homebrew](http://brew.sh)
- Intall Postgres https://www.postgresql.org/download/macosx/
- Intall Node and npm https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

- Install npm modules
  Navigate to the root directory of the app, run
  ```
  npm install
  ```

  then

  ```
  npm run setup
  ```

### Running the local environment:
  ```
  npm start
  ```

### Testing

  ```
  npm test
  ```

### API
  ## Endpoints
  - Fund Account /users/:name/fund-account
    - params(body) - { value: integer/number }
    -  **example:**  ```curl -d '{"value":2}' -H "Content-Type: application/json" -X POST http://localhost:3005/users/frank/fund-account```
  - Check balance /users/:name/balance
    - params - nil
    - **example:**  curl -X GET ```curl -X GET http://localhost:3005/users/frank/balance```
  - Book Flight /users/john/book-flight
    - params(body) - { spacecraft: string, origin: string, destination: string }
    - **example:**   ```curl -d '{"spacecraft": "Falcon 9", "origin": "Abuja", "destination": "Moon"}' -H "Content-Type: application/json" -X POST http://localhost:3005/users/frank/book-flight```
  - Create user  /users
    - params(body) - {name: string}
    - **example:** curl -d '{"name": "Tunde"}' -H "Content-Type: application/json" -X POST http://localhost:3005/users
  - View stations /stations
    - params(body) - nil
    - **example:**  ```curl -X GET http://localhost:3005/stations```
  - View spacecrafts /spacecrafts
    - params(body) - nil
    - **example:**  ```curl -X GET http://localhost:3005/spacecrafts```

#### Additional info
Authentication isn't setup on the app, you do not have to create new user - a user named(Name) **Frank** is available for use
Port `3005` is used for local development
  ```
    curl -X GET http://localhost:3005`
  ```
