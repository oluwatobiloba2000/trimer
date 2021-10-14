import { validateId } from '../middleware/url.validate';
import { getLinksForUser, getUserById } from '../repo/user';
import { NOT_FOUND, OK, SERVER_ERROR, BAD_REQUEST} from '../utils/http-constants';
import { error, success } from '../utils/http-response';

class User {

    static async getAllLinksForUser(req, res) {
        const { user: userId } = req.user;
        try {
            const { error: validationError } = validateId({id: userId});
    
            if (validationError) {
               return error(res, BAD_REQUEST, validationError.message);
            }
            
            const user = getUserById({res, userId})
            if(!user) return error(res, NOT_FOUND, "user not found");
            const user_links = await getLinksForUser({ res, userId });
               
            return success(res, OK, "shorten url fetched success", user_links);

        } catch (error) {
            return error(res, SERVER_ERROR, 'cannot fetch user links');
        }
    }

}

export default User;