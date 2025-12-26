import express, { Request, Response } from 'express';
import * as userController from '../controllers/userController';
import {requireAuth} from '../middleware/requireAuth';
const router = express.Router();

router.get('/me', requireAuth, userController.getUserInfo);

router.post('/signup', userController.userSignup);

router.post('/login', userController.userLogin);
  
export default router;
