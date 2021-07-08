import { SECRET_JWT_KEY } from "../config/constants";
import { SERVER_ERROR, UN_AUTHORIZED } from "../utils/http-constants";
import { error } from "../utils/http-response";
import jwt from 'jsonwebtoken';

export const checkToken = (req, res, next) => {
    const header = req.headers.authorization;
    try {
      if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1] || req.token;
        const decodedToken = jwt.verify(token, SECRET_JWT_KEY);
        if (decodedToken) {
          req.user = decodedToken;
          req.token = token;
          return next();
        }
        return error(res, UN_AUTHORIZED, 'invalid token')
      }
      // if header is undefined , return bad request
      return error(res, UN_AUTHORIZED, 'not Authorized' )
  
    } catch (err) {
      return error(res, SERVER_ERROR, 'cannot verify token');
    }
  };