import { Request, Response, NextFunction } from 'express';
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
      .json({ success: false, msg: `No addresses found`, data: [] });
  }
};

/**
 * CREATE IP BLOCK
 * @param req Block to add in CIDR notation '10.0.0.1/28'
 * @param res Descrition of created IP block
 */
export const statusById = async (req: Request, res: Response) => {
  try {
    const { addr: ipAddress } = req.params;
    const address = await Address.findOne({ address: ipAddress });
    if (!(await Address.findOne({ address: ipAddress }))) {
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
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: `No addresses found`, data: [] });
  }
};

/**
 * CREATE IP BLOCK
 * @param req Block to add in CIDR notation '10.0.0.1/28'
 * @param res Descrition of created IP block
 */
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
      data: [
        `Created: ${addresses.length} IPs in block ${address}`,
        `Starting IP: ${block.first}(${block.mask})`,
        `Ending IP: ${block.last}(${block.mask})`,
        `Hostmask: ${block.hostmask} `,
        `All status: available`,
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error} - There was an error in createCdirBlock() addresses controller`,
    });
  }
};

/**
 * PATCH STATUS OF GIVEN ADDRESS, MUST BE OF STRING 'acquired' or 'available'
 * @param req Status to update provide 'address' and 'status'
 * @param res Update confirmation
 */
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

/**
 * DELETE
 * @param req Address to remove. Pass 'address' in body ex: {"address":"10.0.0.1"}, or optionally DELETE ON 'api/cidr/10.0.0.1'
 * @param res Delete confirmation
 */
export const deleteAddress = async (req: Request, res: Response) => {
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
    if (!(await Address.exists({ address: ipBody || ipParam }))) {
      return res.status(404).json({
        success: false,
        msg: `No existing IP address`,
      });
    }

    //418 :D IF DELETE SUCCESS
    if (await Address.findOne({ address: ipBody })) {
      await Address.findOneAndDelete({ address: ipBody });
      res.status(200).json({
        success: true,
        msg: `IP: ${ipBody} DELETED. The server refuses the attempt to brew coffee with a teapot.`,
        data: [`address removed: ${ipBody}`],
      });
    } else {
      await Address.findOneAndDelete({ address: ipParam });
      res.status(200).json({
        success: true,
        msg: `IP: ${ipParam} DELETED. The server refuses the attempt to brew coffee with a teapot.`,
        data: [`address removed: ${ipParam}`],
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
