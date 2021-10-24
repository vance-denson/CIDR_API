"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateStatus = exports.createIpAddresses = exports.statusById = exports.listIpAddresses = void 0;
const address_1 = require("../models/address");
const netmask_1 = require("netmask");
// const Netmask = require('netmask').Netmask;
//GET ALL IP ADDRESSES CURRENTLY IN THE COLLECTION
const listIpAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addresses = yield address_1.Address.find({});
        res.status(200).json({ addresses });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, msg: `No addresses found`, data: [] });
    }
});
exports.listIpAddresses = listIpAddresses;
/**
 * CREATE IP BLOCK
 * @param req Block to add in CIDR notation '10.0.0.1/28'
 * @param res Descrition of created IP block
 */
const statusById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { addr: ipAddress } = req.params;
        const address = yield address_1.Address.findOne({ address: ipAddress });
        if (!(yield address_1.Address.findOne({ address: ipAddress }))) {
            return res.status(404).json({
                success: false,
                msg: `No existing IP address at ${ipAddress}`,
            });
        }
        res
            .status(401)
            .json({ success: true, msg: `Status of ${ipAddress}`, data: [address] });
        console.log(req._read.toString);
        console.log(req.query);
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, msg: `No addresses found`, data: [] });
    }
});
exports.statusById = statusById;
/**
 * CREATE IP BLOCK
 * @param req Block to add in CIDR notation '10.0.0.1/28'
 * @param res Descrition of created IP block
 */
const createIpAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address: address, status: status } = req.body;
        const block = new netmask_1.Netmask(address);
        let addresses = [];
        block.forEach((ip, long, i) => {
            addresses.push(ip);
        });
        yield address_1.Address.deleteMany({});
        yield Promise.all(addresses.map((addr) => __awaiter(void 0, void 0, void 0, function* () {
            address_1.Address.create({ address: addr, status: 'available' });
        })));
        res.status(201).json({
            success: true,
            msg: `Created address block from ${block.first} to ${block.last} in subnet ${block.mask} (${addresses.length} IPs created), all status set to 'available'`,
            data: [
                `Created: ${addresses.length} IPs in block ${address}`,
                `Starting IP: ${block.first}(${block.mask})`,
                `Ending IP: ${block.last}(${block.mask})`,
                `Hostmask: ${block.hostmask} `,
                `All status: available`,
            ],
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: `${error} - There was an error in createCdirBlock() addresses controller`,
        });
    }
});
exports.createIpAddresses = createIpAddresses;
/**
 * PATCH STATUS OF GIVEN ADDRESS, MUST BE OF STRING 'acquired' or 'available'
 * @param req Status to update provide 'address' and 'status'
 * @param res Update confirmation
 */
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address: ipAddress, status: newStatus } = req.body;
        if (!(yield address_1.Address.findOne({ address: ipAddress }))) {
            return res.status(404).json({
                success: false,
                msg: `No existing IP address at ${ipAddress}`,
            });
        }
        yield address_1.Address.findOneAndUpdate({ address: ipAddress }, req.body, {
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
});
exports.updateStatus = updateStatus;
/**
 * DELETE
 * @param req Address to remove. Pass 'address' in body ex: {"address":"10.0.0.1"}, or optionally DELETE ON 'api/cidr/10.0.0.1'
 * @param res Delete confirmation
 */
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address: ipBody } = req.body;
        const { addr: ipParam } = req.params;
        //404 WITH USEAGE INSTRUCTION IF PARAMETERS OR BODY ARE INCORRECT
        if (ipParam === undefined && (ipBody == '' || ipBody == undefined)) {
            return res.status(404).json({
                success: false,
                msg: `USAGE: DELETE /api/cidr/x.x.x.x or body{"address":"x.x.x.x"}`,
            });
        }
        //404 IF ADDRESS DOES NOT EXIST
        if (!(yield address_1.Address.exists({ address: ipBody || ipParam }))) {
            return res.status(404).json({
                success: false,
                msg: `No existing IP address`,
            });
        }
        //418 :D IF DELETE SUCCESS
        if (yield address_1.Address.findOne({ address: ipBody })) {
            yield address_1.Address.findOneAndDelete({ address: ipBody });
            res.status(200).json({
                success: true,
                msg: `IP: ${ipBody} DELETED. The server refuses the attempt to brew coffee with a teapot.`,
                data: [`address removed: ${ipBody}`],
            });
        }
        else {
            yield address_1.Address.findOneAndDelete({ address: ipParam });
            res.status(200).json({
                success: true,
                msg: `IP: ${ipParam} DELETED. The server refuses the attempt to brew coffee with a teapot.`,
                data: [`address removed: ${ipParam}`],
            });
        }
    }
    catch (error) {
        res.status(500).json({ msg: error });
    }
});
exports.deleteAddress = deleteAddress;
