"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = void 0;
// swagger.js
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const path_1 = __importDefault(require("path"));
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SUBSUM API",
            version: "1.0.0",
            description: "API documentation for SUBSUM Application",
        },
        servers: [
            {
                url: "https://sub-sum.onrender.com",
                description: "Development server",
            },
        ],
    },
    apis: [`${path_1.default.join("router", "router.ts")}`], // Path to your API route files
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.swaggerSpec = swaggerSpec;
