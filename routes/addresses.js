//ROUTER CONFIGURATION AND CONTROLLER ATTACHEMENT
const express = require('express');
const router = express.Router();

const {
  listIpAddresses,
  createIpAddresses,
  updateStatus,
} = require('../controllers/addresses');

router
  .route('/')
  .get(listIpAddresses)
  .post(createIpAddresses)
  .patch(updateStatus);

module.exports = router;
