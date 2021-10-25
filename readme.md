## Usage

Routes:

```
POST: {{localhost:3000}}/api/cidr
- body:
{"address":"10.0.0.1/24"}

GET: {{localhost:3000}}/api/cidr

GET: {{localhost:3000}}/api/cidr?addr=
- example: {GET /api/cidr?addr=10.0.0.1}

PATCH: {{localhost:3000}}/api/cidr
- body:
{
  "address":"10.0.0.2"
  "status":"acquired"
}

DELETE: {{localhost:3000}}/api/cidr
- body:
{"address":"10.0.0.1"}

```

## v1.1 - 10-24-2021

- Refactored all to TypeScript
- Added Mocha (test runner) and Chai (Assertion library - underlying package & syntax of Postman tests)
- Added DELETE and GET /:addr paths
- Chai tests added to /test, organzied by function
-

### `npm run test`

Added Packages:

```
  Dependencies and Types added: {
    "chai": "^4.3.4", - Assert library Postman based on
    "mocha": "^9.1.3", - Test Runner
    "supertest": "^6.1.6", - HTTP requests
    "ts-node": "^10.4.0", - Types for node
    "tsconfig-paths": "^3.11.0" - Assists with path resolution
```

## v1.0 - 10-18-2021

Packages:

---

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
