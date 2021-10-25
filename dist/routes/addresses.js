"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//ROUTER CONFIGURATION AND CONTROLLER ATTACHEMENT
const addresses_1 = require("../controllers/addresses");
const express = require('express');
const router = express.Router();
router
    .route('/')
    .get(addresses_1.listIpAddresses)
    .post(addresses_1.createIpAddresses)
    .patch(addresses_1.updateStatus)
    .delete(addresses_1.deleteAddress, addresses_1.listIpAddresses);
router.route('/:addr').get(addresses_1.statusByAddr).delete(addresses_1.deleteAddress);
module.exports = router;
