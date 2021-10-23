"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.createIpAddresses = exports.listIpAddresses = void 0;
const address_1 = require("../models/address");
const netmask_1 = require("netmask");
// const Netmask = require('netmask').Netmask;
//GET ALL IP ADDRESSES CURRENTLY IN THE COLLECTION
const listIpAddresses = async (req, res) => {
    try {
        const addresses = await address_1.Address.find({});
        res.status(200).json({ addresses });
    }
    catch (error) {
        res
            .status(500)
            .json({ msg: `No addresses found`, success: false, data: [] });
    }
};
exports.listIpAddresses = listIpAddresses;
//DELETE PREVIOUS COLLECTION THEN POST A NEW WORKING BLOCK OF IPs BASED ON CIDR NOTATION GIVEN
const createIpAddresses = async (req, res) => {
    try {
        const { address: address, status: status } = req.body;
        const block = new netmask_1.Netmask(address);
        let addresses = [];
        block.forEach((ip, long, i) => {
            addresses.push(ip);
        });
        await address_1.Address.deleteMany({});
        await Promise.all(addresses.map(async (addr) => {
            address_1.Address.create({ address: addr, status: 'available' });
        }));
        res.status(201).json({
            success: true,
            msg: `Created address block from ${block.first} to ${block.last} in subnet ${block.mask} (${addresses.length} IPs created), all status set to 'available'`,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: `${error} - There was an error in createCdirBlock() addresses controller`,
        });
    }
};
exports.createIpAddresses = createIpAddresses;
//PATCH STATUS OF GIVEN ADDRESS, MUST BE OF STRING 'acquired' or 'available'
const updateStatus = async (req, res) => {
    try {
        const { address: ipAddress, status: newStatus } = req.body;
        if (!(await address_1.Address.findOne({ address: ipAddress }))) {
            return res.status(404).json({
                success: false,
                msg: `No existing IP address at ${ipAddress}`,
            });
        }
        await address_1.Address.findOneAndUpdate({ address: ipAddress }, req.body, {
            new: true,
            runValidators: true,
        });
        res
            .status(200)
            .json({ msg: `IP: ${ipAddress} updated to status: ${newStatus}` });
    }
    catch (error) {
        res.status(500).json({ msg: error });
    }
};
exports.updateStatus = updateStatus;
