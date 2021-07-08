import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserSchema from "../database/models/user";
import { getUser, getUserExcludePassword } from '../repo/user';
import { BAD_REQUEST, OK, SERVER_ERROR, UN_AUTHORIZED } from '../utils/http-constants';
import { error, success } from '../utils/http-response';
import { SECRET_JWT_KEY } from '../config/constants';
import { validateAuth } from '../middleware/url.validate';

class Auth {

    static async Login(req, res) {
        const { email, password } = req.body;
        try {
            const { error: validationError } = validateAuth({ email, password });

            if (validationError) {
                return error(res, BAD_REQUEST, validationError.message);
            }

            const recordExist = await getUser({ res, email });
            if (recordExist) {
                const match = await bcrypt.compare(
                    password,
                    recordExist.password,
                );

                if (match) {
                    return jwt.sign({
                        user: recordExist._id
                    }, SECRET_JWT_KEY, { expiresIn: '30d' }, async (err, token) => {
                        if (err) {
                            return error(res, UN_AUTHORIZED, err);
                        }
                        const user = await getUserExcludePassword({ res, email });
                        return success(res, OK, 'Login uccess', {
                            user,
                            token
                        });
                    });
                }
                return error(res, UN_AUTHORIZED, 'Incorrect email or password');
            }
            return error(res, UN_AUTHORIZED, 'Incorrect email or password');
        } catch (error) {
            return error(res, SERVER_ERROR, 'cannot login user');
        }
    }


    static async Signup(req, res) {
        const { email, password } = req.body;

        try {
            const { error: validationError } = validateAuth({ email, password });

            if (validationError) {
                return error(res, BAD_REQUEST, validationError.message);
            }

            const recordExist = await getUser({ email });
            if (recordExist) return error(res, BAD_REQUEST, 'email already exists');

            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(password, saltRounds);

            return UserSchema.create({
                email,
                password: hashedPassword
            }, (err, data) => {
                if (err) {
                    return error(res, SERVER_ERROR, 'could not create user');
                } else {
                    return jwt.sign({
                        userId: data._id
                    }, SECRET_JWT_KEY, { expiresIn: '30d' }, async (err, token) => {
                        if (err) {
                            return error(res, UN_AUTHORIZED, err);
                        }

                        return success(res, OK, 'Signup success', {
                            user: {
                                _id: data._id,
                                email: data.email
                            },
                            token
                        });
                    });
                }
            })
           
        } catch (error) {
            return error(res, SERVER_ERROR, 'could not register user');
        }
    }
}

export default Auth;