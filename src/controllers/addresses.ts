import { Request, Response, NextFunction } from 'express';
import { Address } from '../models/address';
import { Netmask } from 'netmask';

/**
 * @param req Default route: void
 * @param res Collection of addresses in DB
 * @route GET /
 * @desc GET All addresses in collection
 * @access PUBLIC
 */
export const listIpAddresses = async (req: Request, res: Response) => {
  try {
    //200 IF ADDR FOUND, 404 IF NO ADDRESSES IN COLLECTION
    const addresses = await Address.find({});
    if (addresses.length == 0) {
      res
        .status(404)
        .json({ success: false, msg: `No addresses found`, data: [null] });
    }
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500);
  }
};

/**
 * @param req IP address from URL param
 * @param res Address requested and current status
 * @route GET /?:addr
 * @desc Update status by IP
 * @access PUBLIC
 */
export const statusByAddr = async (req: Request, res: Response) => {
  try {
    const { addr: ipAddress } = req.params;
    const address = await Address.findOne({ address: ipAddress });

    //404 IF ADDRESS DOES NOT EXIST
    if (!(await Address.findOne({ address: ipAddress }))) {
      return res.status(404).json({
        success: false,
        msg: `No existing IP address at ${ipAddress}`,
      });
    }

    //200 IF READ SUCCESS
    res.status(200).json({
      success: true,
      msg: `Status of ${ipAddress}: ${address.status}`,
      data: [address],
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: `No addresses found`, data: [] });
  }
};

/**
 * @param req Block to add in CIDR notation '10.0.0.1/28'
 * @param res Descrition of created IP block
 * @route POST /:addr/mask
 * @desc Create IP block
 * @access PUBLIC
 */
export const createIpAddresses = async (req: Request, res: Response) => {
  try {
    const { address: address, status: status } = req.body;

    //NETMASK PARSE OF IP STRING
    const block = new Netmask(address);
    let addresses: string[] = [];
    block.forEach((ip: string, long: number, i: number) => {
      addresses.push(ip);
    });

    //201 IF CREATE SUCCESS
    //FUTURE - FILTER AND APPEND TO EXISTING LIST. EXPLICIT AUTHORIZED DELETE.
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
        `Hostmask: ${block.hostmask}`,
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
 * @param req Status to update provide 'address' and 'status'
 * @param res Update confirmation
 * @route PATCH /
 * @desc Patch status of 'address', status must be 'acquired' or 'available'
 * @access PUBLIC
 */
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { address: ipAddress, status: newStatus } = req.body;

    //404 IF ADDRESS DOES NOT EXIST
    if (!(await Address.findOne({ address: ipAddress }))) {
      return res.status(404).json({
        success: false,
        msg: `No existing IP address at ${ipAddress}`,
      });
    }

    //200 IF PATCH SUCCESS
    await Address.findOneAndUpdate({ address: ipAddress }, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({
        success: false,
        msg: `IP: ${ipAddress} updated to status: ${newStatus}`,
      });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

/**
 * @param req Address to remove. Pass 'address' in body ex: {"address":"10.0.0.1"}, or optionally DELETE ON 'api/cidr/10.0.0.1'
 * @param res Delete confirmation
 * @route DELETE /
 * @route DELETE /?:addr
 * @desc Delete using body 'address' OR URI param
 * @access PUBLIC
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

    //200 IF DELETE SUCCESS
    if (await Address.findOne({ address: ipBody })) {
      await Address.findOneAndDelete({ address: ipBody });
      res.status(200).json({
        success: true,
        msg: `IP: ${ipBody} DELETED.`,
        data: [`address removed: ${ipBody}`],
      });
    } else {
      await Address.findOneAndDelete({ address: ipParam });
      res.status(200).json({
        success: true,
        msg: `IP: ${ipParam} DELETED.`,
        data: [`address removed: ${ipParam}`],
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
