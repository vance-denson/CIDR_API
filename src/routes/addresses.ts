//ROUTER CONFIGURATION AND CONTROLLER ATTACHEMENT
import {
  listIpAddresses,
  createIpAddresses,
  updateStatus,
} from '../controllers/addresses';
const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(listIpAddresses)
  .post(createIpAddresses)
  .patch(updateStatus);

module.exports = router;
