import express from 'express';
import cors from 'cors';
import db from './src/database/db';
import device from 'express-device';
import { PORT } from './src/config/constants';
import router from './src/routes';
import Url from './src/controllers/url'
require('dotenv').config();        
                   
const app = express();
    
app.use(cors());

app.use(express.json());
app.use(device.capture());
app.use('/api', router);
app.get('/:id', Url.GetUrlAndUpdateCount);


const APP_PORT = PORT || 3000;


const server = app.listen(APP_PORT, () => {
 console.log(`listening on port ${APP_PORT}`);
});

module.exports = server;
