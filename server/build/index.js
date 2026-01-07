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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const mongo_1 = require("./db/mongo");
const dotenv_1 = __importDefault(require("dotenv"));
const yelpRoutes_1 = __importDefault(require("./routes/yelpRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
(() => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, mongo_1.getDb)();
    yield db.command({ ping: 1 });
    console.log("MongoDB ready");
}))().catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
});
app.get("/", (req, res) => {
    res.send("TypeScript With Express");
});
app.use("/users", userRoutes_1.default);
app.use("/api/yelp", yelpRoutes_1.default);
app.listen(port, () => {
    console.log(`TypeScript with Express http://localhost:${port}/`);
});
//npm start to start the server
//http://localhost:3000/
