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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByUsername = findUserByUsername;
exports.findUserByEmail = findUserByEmail;
exports.createNewUser = createNewUser;
exports.logUserIn = logUserIn;
exports.addVisitedRestaurant = addVisitedRestaurant;
exports.getVisitedRestaurants = getVisitedRestaurants;
const Auth = __importStar(require("../utils/auth"));
const mongo_1 = require("../db/mongo");
// MongoDB collection name for users
const USERS_COLLECTION = "users";
function findUserByUsername(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, mongo_1.getDb)();
        const user = yield db.collection(USERS_COLLECTION).findOne({ username: name });
        return user;
    });
}
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, mongo_1.getDb)();
        const user = yield db.collection(USERS_COLLECTION).findOne({ email: email });
        return user;
    });
}
function createNewUser(name, password, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, mongo_1.getDb)();
        const hashedPassword = yield Auth.hashPassword(password);
        const newUser = {
            username: name,
            password: hashedPassword,
            email: email,
            visited_restaurants: [],
            createdAt: new Date(),
        };
        yield db.collection(USERS_COLLECTION).insertOne(newUser);
    });
}
function logUserIn(name, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield findUserByUsername(name);
        if (!user) {
            return null;
        }
        const passwordMatch = yield Auth.verifyPassword(password, user.password);
        if (!passwordMatch) {
            return null;
        }
        return user;
    });
}
function addVisitedRestaurant(username, restaurantData) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, mongo_1.getDb)();
        const result = yield db.collection(USERS_COLLECTION).findOneAndUpdate({ username: username }, { $push: { visited_restaurants: restaurantData } }, { returnDocument: "after" });
        return result;
    });
}
function getVisitedRestaurants(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield findUserByUsername(username);
        if (!user) {
            return [];
        }
        return user.visited_restaurants || [];
    });
}
