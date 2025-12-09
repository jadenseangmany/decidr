import express, { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from "bcrypt";

const router = express.Router();

//Hashing password functions
async function hashPassword(rawPassword: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
  return hashedPassword;
}

async function verifyPassword(rawPassword: string, hashedPassword: string) {
  return await bcrypt.compare(rawPassword, hashedPassword);
}

const tempUserDB = [
  new User("Terry", "somerandomhashedpassword", "terryguan@gmail.com")
];

//This just returns the information of a user.
router.get('/info/:username', (req: Request, res: Response) => {
  const username = req.params.username;
  const user = tempUserDB.find((u) => u.getUsername() === username);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

//This is a simple signup route, it's able to hash passwords and do validation checks.
router.post('/signup', async (req: Request, res: Response) => {

  const{username, password, email} = req.body;

  if(!username){
    return res.status(400).json({ message: "Please provide a username" });
  }
  if(!password){
    return res.status(400).json({ message: "Please provide a password" });
  }
  if(!email){
    return res.status(400).json({ message: "Please provide a email" });
  }

  if(tempUserDB.find((u) => u.getUsername() == username)){
    return res.status(400).json({ message: "Username is already taken, try again" });
  }

  if(tempUserDB.find((u) => u.getEmail() == email)){
    return res.status(400).json({ message: "There's already an account associated with this email" });
  }

  const hashedPassword = await hashPassword(password);

  const user = new User(username,hashedPassword,email);

  tempUserDB.push(user);

  res.status(201).json({
    message: "Signup successful",
    user: {
      username: user.getUsername(),
      email: user.getEmail()
    }
  });
});

//not able to send tokens yet
router.post('/login', async (req: Request, res: Response) => {
  const{username, password} = req.body;
    if (!username || !password) {
    return res.status(400).json({ message: "Please provide username and password" });
    }

    const user = tempUserDB.find(u => u.getUsername() === username);

    if (!user) {
      return res.status(400).json({ message: "Username or Password doesn't match" });
    }

    const passwordMatch = await verifyPassword(password,user.getPassword())

    if(!passwordMatch){
      return res.status(400).json({ message: "Username or Password doesn't match"});
    }

    res.status(200).json({
      message: "Login successful",
      username: user.getUsername(),
      email: user.getEmail()
    });
  });
  
export default router;


//http://localhost:3000/users/info/Terry
//http://localhost:3000/users/testuser
//http://localhost:3000/users/signup


/*
small json test for postman
{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com"
}
*/
