import { BAD_REQUEST, NOT_FOUND, OK, SERVER_ERROR } from '../utils/http-constants';
import { error, success } from '../utils/http-response';
import { nanoid } from 'nanoid'
import { getUrlByClipped_url_id, saveUrlMetrics } from '../repo/url';
import mongoose from 'mongoose';
import url from '../database/models/url';
import url_metrics from '../database/models/url_metrics';
import { validateId, validateUrl } from '../middleware/url.validate';
import { HOME_DOMAIN_NAME } from '../config/constants';

class Url {

    static async Create_short_link(req, res) {
        const { original_url, clipped_url_id } = req.body;
        const { userId } = req.user;
        try {
            const { error: validationError } = validateUrl({original_url, clipped_url_id});

            if (validationError) {
               return error(res, BAD_REQUEST, validationError.message);
            }


            let newCustomClipped_url;
            if (clipped_url_id) {

                let customClipped_url = clipped_url_id.split(" ").join("-");
                const clipped_url_exist = await getUrlByClipped_url_id({ res, clipped_url_id : customClipped_url });
                if (clipped_url_exist) {
                    return error(res, BAD_REQUEST, 'custom url already taken');
                }
                newCustomClipped_url = customClipped_url;
            } else {
                newCustomClipped_url = nanoid(5);
            }

            const domain_name = process.env.DOMAIN_NAME;

            url.create({
                original_url,
                clipped_url_id: newCustomClipped_url,
                clipped_url: `${domain_name}/${newCustomClipped_url}`,
                user: userId
            }, (err, data)=>{
                if (err) {
                    return error(res, BAD_REQUEST, 'could not create url');
                }else{
                 return success(res, OK, "url shorten success", data);
                }
            })

        } catch (error) {
            console.log(error)
            return error(res, SERVER_ERROR, 'cannot create shorten url');
        }
    }


    static async GetUrlAndUpdateCount (req, res){
       const { id } = req.params;

       try {

        if (!id) {
           return res.redirect(HOME_DOMAIN_NAME);
        }

    
           const url_link = await url.findOne({
            clipped_url_id: id
          });
    
          if(!url_link){
              return error(res, NOT_FOUND, "url not found");
          }
    
          // save metrics
          saveUrlMetrics(req, url_link._id)

          url_link.click_count += 1;
          await url_link.save();

          if(url_link.original_url){
            res.redirect(url_link.original_url);
          }
           
       } catch (error) {
        return error(res, SERVER_ERROR, 'cannot redirect url');          
       }
    }


    static GetUrlMetrics(req, res){
        const {id: urlShortenId} = req.params;

        const { error: validationError } = validateId({id: urlShortenId});

        if (validationError) {
           return error(res, BAD_REQUEST, validationError.message);
        }

        url_metrics.aggregate([
            { // match stage to select metrics for a specific shortened url
                '$match': {
                  'urlShortenId': mongoose.Types.ObjectId(urlShortenId)
                }
              }, { // facet stage to query results from the last stage without making any queries to db
                '$facet': {
                  'byDevice': [{
                    '$group': { // group by device
                      '_id': '$device',
                      'count': {
                        '$sum': 1
                      }
                    }
                  }],
                  'byLocation': [{
                    '$group': { // group by country/location
                      '_id': '$country',
                      'count': {
                        '$sum': 1
                      }
                    }
                  }],
                  'byReferer': [{
                    '$group': { // group by referer
                      '_id': '$referer',
                      'count': {
                        '$sum': 1
                      }
                    }
                  }],
                  'byLanguage': [{
                    '$group': { // group by language
                      '_id': '$language',
                      'count': {
                        '$sum': 1
                      }
                    }
                  }],
                  'byRegion': [{
                    '$group': { // group by region
                      '_id': '$region',
                      'count': {
                        '$sum': 1
                      }
                    }
                  }],
                  'byBrowser': [{
                    '$group': { // group by region
                      '_id': '$browser',
                      'count': {
                        '$sum': 1
                      }
                    }
                  }]
                }
              }
        ])
        .then(docs => {
            return success(res, OK, "url analytics", docs[0])
        })
    }

}

export default Url;