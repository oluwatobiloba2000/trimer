import UserSchema from "../database/models/user";
import { error } from "../utils/http-response";
import { SERVER_ERROR } from "../utils/http-constants";
import url from "../database/models/url";

export const getUser = async ({ res, email }) => {
    return UserSchema.findOne({ email }, (err, data) => {
        if (err) {
            return error(res, SERVER_ERROR, 'could not register user');
        } else {
            return data;
        }
    })
}

export const getUserById = async ({ res, userId }) => {
    return UserSchema.findOne({ id: userId }, (err, data) => {
        if (err) {
            return error(res, SERVER_ERROR, 'could not register user');
        } else {
            return data;
        }
    })
}

export const getUserExcludePassword = async ({ res, email }) => {
    return UserSchema.findOne({ email }, { password: 0 }, (err, data) => {
    
        if (err) {
            return error(res, SERVER_ERROR, 'could not fetch user');
        } else {
            return data;
        }
    })
}

export const getLinksForUser = async ({ res, userId }) => {
    return url.find({ user: userId }, (err, data) => {
        if (err) {
            return error(res, SERVER_ERROR, 'could not fetch user links');
        } else {
            return data;
        }
    })
}