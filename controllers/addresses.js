const Address = require('../models/address');
const Netmask = require('netmask').Netmask;

//GET ALL IP ADDRESSES CURRENTLY IN THE COLLECTION
const listIpAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({});
    res.status(200).json({ addresses });
  } catch (error) {
    res
      .status(500)
      .json({ msg: `No addresses found`, success: false, data: [] });
  }
};

//DELETE PREVIOUS COLLECTION THEN POST A NEW WORKING BLOCK OF IPs BASED ON CIDR NOTATION GIVEN
const createIpAddresses = async (req, res) => {
  try {
    const { address: address, status: status } = req.body;
    const block = new Netmask(address);
    let addresses = [];
    block.forEach((ip, long, i) => {
      addresses.push(ip);
    });

    await Address.deleteMany({});

    await Promise.all(
      addresses.map(async (addr) => {
        Address.create({ address: addr, status: 'available' });
      })
    );

    res.status(201).json({
      success: true,
      msg: `Created address block from ${block.first} to ${block.last} in subnet ${block.mask} (${addresses.length} IPs created), all status set to 'available'`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error} - There was an error in createCdirBlock() addresses controller`,
    });
  }
};

//PATCH STATUS OF GIVEN ADDRESS, MUST BE 'acquired' | 'available'
const updateStatus = async (req, res) => {
  try {
    const { address: ipAddress, status: newStatus } = req.body;

    updatedAddress = await Address.findOneAndUpdate(
      { address: ipAddress },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        msg: `No existing IP address at ${ipAddress}`,
      });
    }

    res.status(200).json({ updatedAddress });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

//CONTROLLERS CONSUMED BY ROUTES
module.exports = {
  listIpAddresses,
  createIpAddresses,
  updateStatus,
};
