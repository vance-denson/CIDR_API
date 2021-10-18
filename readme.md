## IP Address Management REST API

Create a simple IP Address Management REST API on top of any data store. It will include the ability to add IP Addresses by CIDR block and then either acquire or release IP addresses individually. Each IP address will have a status associated with it that is either “available” or “acquired”.

### The REST API must support four endpoint:

---

- _Create IP addresses_ - take in a CIDR block (e.g. 10.0.0.1/24) and add all IP addresses within that block to the data store with status “available”
- _List IP addresses_ - return all IP addresses in the system with their current status
- _Acquire an IP_ - set the status of a certain IP to “acquired”
- _Release an IP_ - set the status of a certain IP to “available”
