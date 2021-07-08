import { OK } from "./http-constants"

/** Sends a success message.
  * @param  {Object} res
  * @param  {Number} code - status code to be returned
  * @param  {String} error -  status error to be returned
  * @param  {String} message -  message to be returned
  * @param  {Object} data -  data to be returned
  */

export const success = (res, code, message, data) =>{
    return res.status(code).json({
        status: "ok",
        code : code || OK,
        data,
        message
    })
}


/** Sends an error message.
  * @param  {Object} res
  * @param  {Number} code - status code to be returned
  * @param  {String} error -  status error to be returned
  * @param  {String} message -  message to be returned
  */

export const error = (res, code, message) => {
    return res.status(code).json({
        status: "error",
        code,
        message
    })
}