//ROUTER CONFIGURATION AND CONTROLLER ATTACHEMENT
import {
  listIpAddresses,
  createIpAddresses,
  updateStatus,
  deleteAddress,
  statusById,
} from '../controllers/addresses';
const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(listIpAddresses)
  .post(createIpAddresses)
  .patch(updateStatus)
  .delete(deleteAddress, listIpAddresses);

router.route('/:addr').get(statusById).delete(deleteAddress);

module.exports = router;
