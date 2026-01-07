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
exports.getUserInfo = getUserInfo;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
exports.addVisitedRestaurant = addVisitedRestaurant;
exports.getVisitedRestaurant = getVisitedRestaurant;
const userServices = __importStar(require("../services/userServices"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUserInfo(req, res) {
    var _a;
    const username = (_a = req.user) === null || _a === void 0 ? void 0 : _a.username;
    if (!username) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = userServices.findUserByUsername(username);
    if (user) {
        return res.json({
            "username": user.getUsername(),
            "email": user.getEmail()
        });
    }
    else {
        return res.status(404).json({ message: "User not found" });
    }
}
//for async functions its good to have some error handling
function userSignup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password, email } = req.body;
            if (!username) {
                return res.status(400).json({ message: "Please provide a username" });
            }
            if (!password) {
                return res.status(400).json({ message: "Please provide a password" });
            }
            if (!email) {
                return res.status(400).json({ message: "Please provide an email" });
            }
            const user = userServices.findUserByUsername(username);
            if (user) {
                return res.status(400).json({ message: "Username is already taken, try again" });
            }
            if (userServices.findUserByEmail(email)) {
                return res.status(400).json({ message: "There's already an account associated with this email" });
            }
            yield userServices.createNewUser(username, password, email);
            return res.status(200).json({
                message: "Signup successful",
            });
        }
        catch (err) {
            console.error("Signup error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
function userLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Please provide username and password" });
            }
            const user = yield userServices.logUserIn(username, password);
            if (!user) {
                return res.status(400).json({ message: "Username or Password doesn't match" });
            }
            const token = jsonwebtoken_1.default.sign({ username: user.getUsername() }, process.env.JWT_SECRET, { expiresIn: "15m" });
            return res.status(200).json({
                message: "Login successful",
                token
            });
        }
        catch (err) {
            console.error("Login error", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
function addVisitedRestaurant(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = req.params.username;
            const { restaurant_id, name, location, visited_date, rating, notes } = req.body;
            if (!restaurant_id) {
                return res.status(400).json({ message: "Please provide a restaurant_id" });
            }
            if (!name) {
                return res.status(400).json({ message: "Please provide a restaurant name" });
            }
            if (!location) {
                return res.status(400).json({ message: "Please provide a location" });
            }
            const restaurantData = {
                restaurant_id,
                name,
                location,
                visited_at: visited_date ? new Date(visited_date) : new Date(),
                rating,
                notes
            };
            const user = userServices.addVisitedRestaurant(username, restaurantData);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({
                message: "Restaurant added successfully",
                visited_restaurants: user.getVisitedRestaurants()
            });
        }
        catch (err) {
            console.error("Add visited restaurant error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
function getVisitedRestaurant(req, res) {
    try {
        const username = req.params.username;
        const user = userServices.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            visited_restaurants: user.getVisitedRestaurants()
        });
    }
    catch (err) {
        console.error("Get visited restaurants error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
