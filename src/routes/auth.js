import express from 'express';
import Auth from '../controllers/auth';
const router = express.Router()

router.post('/login', Auth.Login);

router.post('/signup', Auth.Signup);

export default router;
