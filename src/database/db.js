import mongoose from 'mongoose';
import {DB_URL} from '../config/constants';

class Database {
    constructor(){
        this._connect();
    }

    _connect(){
        mongoose
            .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(()=>{
                console.log("Database connected");
            })
            .catch((error)=>{
                console.log(error);
            })
    }
}

export default new Database();