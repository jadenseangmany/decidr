import express, { Request, Response } from 'express';
import * as userController from '../controllers/userController';
//import only the function
import {requireAuth} from '../middleware/requireAuth'

const router = express.Router();

router.get('/:username',requireAuth, userController.getUserInfo);

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

/*
Signup
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123","email":"test@example.com"}'

Login & Grab Token
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

Check
curl http://localhost:3000/users/testuser \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
*/