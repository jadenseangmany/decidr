"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.visited_restaurants = [];
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    getEmail() {
        return this.email;
    }
    setUsername(username) {
        this.username = username;
    }
    setPassword(password) {
        this.password = password;
    }
    setEmail(email) {
        this.email = email;
    }
    addVisitedRestaurant(restaurant) {
        this.visited_restaurants.push(restaurant);
    }
    getVisitedRestaurants() {
        return this.visited_restaurants;
    }
}
exports.default = User;
