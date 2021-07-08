import express from 'express';
import Url from '../controllers/url';
import { checkToken } from '../middleware/checkToken';
const router = express.Router()

router.post('/create', checkToken, Url.Create_short_link);
router.get('/view/:id', checkToken, Url.GetUrlMetrics);

export default router;
