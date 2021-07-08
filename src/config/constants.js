import dotenv from 'dotenv';

dotenv.config();

export const {
    PORT,
    DB_URL,
    SECRET_JWT_KEY,
    HOME_DOMAIN_NAME
} = process.env;