import { Request, Response } from 'express';
import * as userServices from '../services/userServices'
import { VisitedRestaurant } from '../types/restaurant';
import jwt from "jsonwebtoken";

export async function getUserInfo(req: Request, res: Response) {
  try {
    const username = (req as any).user?.username;
    if (!username) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userServices.findUserByUsername(username);
    if (user) {
      return res.json({
        username: user.username,
        email: user.email
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Get user info error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function userSignup(req: Request, res: Response) {
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

    const existingUser = await userServices.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken, try again" });
    }

    const existingEmail = await userServices.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "There's already an account associated with this email" });
    }

    await userServices.createNewUser(username, password, email);

    return res.status(200).json({
      message: "Signup successful",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function userLogin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please provide username and password" });
    }

    const user = await userServices.logUserIn(username, password);

    if (!user) {
      return res.status(400).json({ message: "Username or Password doesn't match" });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function addVisitedRestaurant(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const { restaurant_id, name, location, visited_date, rating, notes, image_url, cuisine } = req.body;

    if (!restaurant_id) {
      return res.status(400).json({ message: "Please provide a restaurant_id" });
    }
    if (!name) {
      return res.status(400).json({ message: "Please provide a restaurant name" });
    }
    if (!location) {
      return res.status(400).json({ message: "Please provide a location" });
    }

    const restaurantData: VisitedRestaurant = {
      restaurant_id,
      name,
      location,
      visited_at: visited_date ? new Date(visited_date) : new Date(),
      rating,
      notes,
      image_url,
      cuisine
    };

    const user = await userServices.addVisitedRestaurant(username, restaurantData);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Restaurant added successfully",
      visited_restaurants: user.visited_restaurants
    });
  } catch (err) {
    console.error("Add visited restaurant error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getVisitedRestaurant(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const restaurants = await userServices.getVisitedRestaurants(username);

    return res.status(200).json({
      visited_restaurants: restaurants
    });
  } catch (err) {
    console.error("Get visited restaurants error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function addSavedRestaurant(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const { restaurant_id, name, location, rating, image_url, cuisine } = req.body;

    if (!restaurant_id) {
      return res.status(400).json({ message: "Please provide a restaurant_id" });
    }
    if (!name) {
      return res.status(400).json({ message: "Please provide a restaurant name" });
    }

    const restaurantData = {
      restaurant_id,
      name,
      location: location || '',
      visited_at: new Date(),
      rating,
      image_url,
      cuisine
    };

    const user = await userServices.addSavedRestaurant(username, restaurantData);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Restaurant saved successfully",
      saved_restaurants: user.saved_restaurants
    });
  } catch (err) {
    console.error("Add saved restaurant error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSavedRestaurant(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const restaurants = await userServices.getSavedRestaurants(username);

    return res.status(200).json({
      saved_restaurants: restaurants
    });
  } catch (err) {
    console.error("Get saved restaurants error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
