## Usage

- Clone

- `npm install`
- `node ./dist/app.js` - Run express server
- `npm run test` - Run assertion libary and execute unit tests

Routes:

```
1. POST {{HOST}}/api/cidr
-> body:
      {"address":"10.1.1.1/30"}

2. GET {{HOST}}/api/cidr
-> body:
      {"address":"10.1.1.1"}

3. GET {{HOST}}/api/cidr/{IP}
-> example:
      {"localhost:300/api/cidr/10.1.1.1"}

4. PATCH {{HOST}}/api/cidr
-> body:
      { "address":"10.1.1.1"
        "status":"acquired | available"}

5. DELETE {{HOST}}/api/cidr
-> body:
      {"address":"10.1.1.1"}

6. DELETE {{HOST}}/api/cidr/{IP}
-> example:
      {"DELETE ON localhost:3000/api/cidr/10.1.1.1"}
```

## v202110.1.2 - 10-26-2021

- Unit test for Post, Patch, Delete added (42 so far), separated into invdivdual test files
- Added appropriae javadoc flags for the controller class

## v202110.1.1 - 10-24-2021

- Refactored all to TypeScript
- Integrated a test runner and Chai (Assertion library - underlying package / syntax used for Postman scripting). Boostrapped, tests to be added.
- Added 2 DELETE routes and 1 GET route (/:IP-param )
- Uniform msg, data, success response fields

Added Packages:

```
  Dependencies and Types added: {
    "chai": "^4.3.4", - Assertion library for Postman
    "mocha": "^9.1.3", - Test Runner
    "chai-http": "^4.3.0" - HTTP requests
    "supertest": "^6.1.6", - HTTP requests (experimenting with alternative)
    "ts-node": "^10.4.0", - Types for node
    "tsconfig-paths": "^3.11.0" - Assists with path resolution
```

## v202110.1.0 - 10-18-2021

Packages:

```
"dependencies": {
    "express": "^4.17.1",
    "mongoose": "^6.0.11",
    "netmask": "^2.0.2"
  },
  "devDependencies": {
    "dotenv": "^10.0.0",
    "nodemon": "^2.0.13"
  }
```

## Task Requirements

---

### IP Address Management REST API

Create a simple IP Address Management REST API on top of any data store. It will include the ability to add IP Addresses by CIDR block and then either acquire or release IP addresses individually. Each IP address will have a status associated with it that is either “available” or “acquired”.

### The REST API must support four endpoint:

- _Create IP addresses_ - take in a CIDR block (e.g. 10.0.0.1/24) and add all IP addresses within that block to the data store with status “available”
- _List IP addresses_ - return all IP addresses in the system with their current status
- _Acquire an IP_ - set the status of a certain IP to “acquired”
- _Release an IP_ - set the status of a certain IP to “available”
