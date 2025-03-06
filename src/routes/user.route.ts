import { Router } from 'express';
import { createUser, getUserDetails, login } from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.route('/register').post(createUser);
router.route('/login').post(login)

// private route

router.route("/").get(authMiddleware,getUserDetails)

export default router;
