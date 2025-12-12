import { Request, Response } from 'express';
import * as userServices from '../services/userServices'


export function getUserInfo(req:Request, res:Response){
  const username = req.params.username;
  const user = userServices.findUserByUsername(username);

  if (user) {
    return res.json(user);
  } else {
    return res.status(404).json({ message: "User not found" });
  }
}

export async function userSignup(req:Request, res:Response){
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

  return res.status(201).json({
    message: "Signup successful",
  });
}

export async function userLogin(req:Request, res:Response){
  const{username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide username and password" });
  }
  
  const user = await userServices.logUserIn(username, password);

  if(!user){
    return res.status(400).json({ message: "Username or Password doesn't match"});
  }

  return res.status(201).json({
    message: "Login successful",
  });

}
