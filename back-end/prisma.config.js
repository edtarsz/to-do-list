"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
require("dotenv/config");
exports.default = {
    schema: node_path_1.default.join(__dirname, 'prisma', 'schema'),
};
//# sourceMappingURL=prisma.config.js.map