import express from 'express';
import AuthRouter from './auth';
import LinkRouter from './url';
import UserRouter from './user';
const router = express.Router()


router.use("/auth", AuthRouter);
router.use("/link", LinkRouter);
router.use("/user", UserRouter);

export default router;