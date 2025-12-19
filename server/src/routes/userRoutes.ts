import express, { Request, Response } from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/:username', userController.getUserInfo);

router.post('/signup', userController.userSignup);

router.post('/login', userController.userLogin);
  
export default router;

//http://localhost:3000/users/Terry
//http://localhost:3000/users/testuser
//http://localhost:3000/users/signup
//http://localhost:3000/users/login

/*
small json test for postman
{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com"
}
*/
