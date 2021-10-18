//ROUTER CONFIGURATION AND CONTROLLER ATTACHEMENT
const express = require('express');
const router = express.Router();

const {
  getAllAddresses,
  createCdirBlock,
  updateStatus,
} = require('../controllers/addresses');

router
  .route('/')
  .get(getAllAddresses)
  .post(createCdirBlock)
  .patch(updateStatus);

module.exports = router;
