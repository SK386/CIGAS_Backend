"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const http_status_codes_1 = require("http-status-codes");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../docs/swagger.json"));
require("dotenv/config");
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
/**
 * App configuration
 */
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: "GET,PUT,POST,DELETE,OPTIONS"
}));
// Parse JSON request bodies
app.use(express_1.default.json());
// Parse URL-encoded request bodies
app.use(express_1.default.urlencoded({ extended: false }));
// Parse Cookie header and populate req.cookies
app.use((0, cookie_parser_1.default)());
// Improve security
app.use((0, helmet_1.default)());
// All app routes
app.use(routes_1.default);
/**
 * Documentation
 */
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.get("/api-docs", (req, res) => {
    res.json({
        swagger: "the API documentation  is now available on https://realworld-temp-api.herokuapp.com/api"
    });
});
app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = err.errorCode ?? http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMsg = err.message ?? http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        status: statusCode,
        message: errorMsg,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});
/**
 * Starting the server
 */
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.info(`Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map