"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//SCHEMA SETUP WITH VALIDATION, 'Address' MODEL
const addressSchema = new mongoose_1.default.Schema({
    address: {
        type: String,
        required: [true, 'An address must be provided'],
        trim: true,
    },
    status: {
        type: String,
        default: 'available',
        trim: true,
        enum: ['acquired', 'available'],
    },
});
exports.Address = mongoose_1.default.model('Address', addressSchema);
