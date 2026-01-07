"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("../controllers/userController"));
const requireAuth_1 = require("../middleware/requireAuth");
const router = express_1.default.Router();
router.get('/me', requireAuth_1.requireAuth, userController.getUserInfo);
router.post('/signup', userController.userSignup);
router.post('/login', userController.userLogin);
router.post('/:username/visited-restaurants', userController.addVisitedRestaurant);
router.get('/:username/visited-restaurants', userController.getVisitedRestaurant);
exports.default = router;
//http://localhost:3000/users/Terry
//http://localhost:3000/users/testuser
//http://localhost:3000/users/signup
//http://localhost:3000/users/login
//http://localhost:3000/users/testuser/visited-restaurants
/*
small json test for postman
{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com"
}

for visited restaurant func
{
  "restaurant_id": "1",
  "name": "Chick-fil-A",
  "location": "San Diego, CA",
  "visited_date": "2026-01-05",
  "rating": "4",
  "notes": "delicious"
}
*/
