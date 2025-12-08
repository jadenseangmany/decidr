import express, { Request, Response } from 'express';
import User from '../models/user';

const router = express.Router();

const tempUserDB = [
  new User("Terry", "password123", "terryguan@gmail.com")
];

router.get('/:username', (req: Request, res: Response) => {
  const username = req.params.username;
  const user = tempUserDB.find((u) => u.getUsername() === username);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

export default router;


//http://localhost:3000/users/Terry
