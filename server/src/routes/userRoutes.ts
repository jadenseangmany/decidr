import express, { Request, Response } from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/:username', userController.getUserInfo);

router.post('/signup', userController.userSignup);

router.post('/login', userController.userLogin);

router.post('/:username/visited-restaurants', userController.addVisitedRestaurant);

router.get('/:username/visited-restaurants', userController.getVisitedRestaurant);
  
export default router;

//http://localhost:3000/users/Terry
//http://localhost:3000/users/testuser
//http://localhost:3000/users/signup
//http://localhost:3000/users/login
//http://localhost:3000/users/testuser/visited-restaurants

/*
small json test for postman
{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com"
}

for visited restaurant func
{
  "restaurant_id": "1",
  "name": "Chick-fil-A",
  "location": "San Diego, CA",
  "visited_date": "2026-01-05",
  "rating": "4",
  "notes": "delicious"
}
*/
