import { VisitedRestaurant } from '../types/restaurant';

class User {
  username: string;
  password: string;
  email: string;
  visited_restaurants: VisitedRestaurant[];

  constructor(username: string, password: string, email: string) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.visited_restaurants = [];
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  getEmail(): string {
    return this.email;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  addVisitedRestaurant(restaurant: VisitedRestaurant): void {
    this.visited_restaurants.push(restaurant);
  }

  getVisitedRestaurants(): VisitedRestaurant[] {
    return this.visited_restaurants;
  }
}

export default User;
