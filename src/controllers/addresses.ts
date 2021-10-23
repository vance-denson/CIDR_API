import { Request, Response } from 'express';
import { Address } from '../models/address';
import { Netmask } from 'netmask';

// const Netmask = require('netmask').Netmask;

//GET ALL IP ADDRESSES CURRENTLY IN THE COLLECTION
export const listIpAddresses = async (req: Request, res: Response) => {
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
export const createIpAddresses = async (req: Request, res: Response) => {
  try {
    const { address: address, status: status } = req.body;
    const block = new Netmask(address);
    let addresses: string[] = [];
    block.forEach((ip: string, long: number, i: number) => {
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

//PATCH STATUS OF GIVEN ADDRESS, MUST BE OF STRING 'acquired' or 'available'
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { address: ipAddress, status: newStatus } = req.body;

    if (!(await Address.findOne({ address: ipAddress }))) {
      return res.status(404).json({
        success: false,
        msg: `No existing IP address at ${ipAddress}`,
      });
    }
    await Address.findOneAndUpdate({ address: ipAddress }, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ msg: `IP: ${ipAddress} updated to status: ${newStatus}` });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
