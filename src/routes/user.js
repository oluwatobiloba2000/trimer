import express from 'express';
import User from '../controllers/user';
import { checkToken } from '../middleware/checkToken';
const router = express.Router()

router.get('/links', checkToken, User.getAllLinksForUser);

export default router;