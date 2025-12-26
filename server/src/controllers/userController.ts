import { Request, Response } from 'express';
import * as userServices from '../services/userServices'
import jwt from "jsonwebtoken";

export function getUserInfo(req:Request, res:Response){
  const username = req.params.username;
  const user = userServices.findUserByUsername(username);

  if (user) {
    return res.json({
      "username": user.getUsername(),
      "email": user.getEmail()
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
}

//for async functions its good to have some error handling
export async function userSignup(req:Request, res:Response){
  try{
    const{username, password, email} = req.body;

    if(!username){
      return res.status(400).json({ message: "Please provide a username" });
    }
    if(!password){
      return res.status(400).json({ message: "Please provide a password" });
    }
    if(!email){
      return res.status(400).json({ message: "Please provide an email" });
    }

    const user = userServices.findUserByUsername(username);

    if(user){
      return res.status(400).json({ message: "Username is already taken, try again" });
    }

    if(userServices.findUserByEmail(email)){
      return res.status(400).json({ message: "There's already an account associated with this email" });
    }
    
    await userServices.createNewUser(username,password, email);

    return res.status(200).json({
      message: "Signup successful",
    });
  }catch(err){
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function userLogin(req:Request, res:Response){
  try{
    const{username, password} = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please provide username and password" });
    }
    
    const user = await userServices.logUserIn(username, password);

    if(!user){
      return res.status(400).json({ message: "Username or Password doesn't match"});
    }

    const token = jwt.sign(
      { username: user.getUsername() },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      message: "Login successful",
      token
    });
  }catch(err){
    console.error("Login error",err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

