import { Router } from "express";
import { getRestaurants } from "../controllers/yelpController";

const router = Router();

router.get("/restaurants", getRestaurants);

export default router;
