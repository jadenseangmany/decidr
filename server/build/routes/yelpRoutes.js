"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const yelpController_1 = require("../controllers/yelpController");
const router = (0, express_1.Router)();
router.get("/restaurants", yelpController_1.getRestaurants);
exports.default = router;
