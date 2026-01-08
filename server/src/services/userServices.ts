import * as Auth from "../utils/auth";
import { VisitedRestaurant } from "../types/restaurant";
import { getDb } from "../db/mongo";

// MongoDB collection name for users
const USERS_COLLECTION = "users";

// User document interface for MongoDB
interface UserDocument {
  username: string;
  password: string;
  email: string;
  visited_restaurants: VisitedRestaurant[];
  createdAt: Date;
}

export async function findUserByUsername(name: string): Promise<UserDocument | null> {
  const db = await getDb();
  const user = await db.collection<UserDocument>(USERS_COLLECTION).findOne({ username: name });
  return user;
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  const db = await getDb();
  const user = await db.collection<UserDocument>(USERS_COLLECTION).findOne({ email: email });
  return user;
}

export async function createNewUser(name: string, password: string, email: string): Promise<void> {
  const db = await getDb();
  const hashedPassword = await Auth.hashPassword(password);

  const newUser: UserDocument = {
    username: name,
    password: hashedPassword,
    email: email,
    visited_restaurants: [],
    createdAt: new Date(),
  };

  await db.collection<UserDocument>(USERS_COLLECTION).insertOne(newUser);
}

export async function logUserIn(name: string, password: string): Promise<UserDocument | null> {
  const user = await findUserByUsername(name);
  if (!user) {
    return null;
  }

  const passwordMatch = await Auth.verifyPassword(password, user.password);
  if (!passwordMatch) {
    return null;
  }

  return user;
}

export async function addVisitedRestaurant(username: string, restaurantData: VisitedRestaurant): Promise<UserDocument | null> {
  const db = await getDb();

  const result = await db.collection<UserDocument>(USERS_COLLECTION).findOneAndUpdate(
    { username: username },
    { $push: { visited_restaurants: restaurantData } },
    { returnDocument: "after" }
  );

  return result;
}

export async function getVisitedRestaurants(username: string): Promise<VisitedRestaurant[]> {
  const user = await findUserByUsername(username);
  if (!user) {
    return [];
  }
  return user.visited_restaurants || [];
}