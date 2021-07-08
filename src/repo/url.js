import url from "../database/models/url";
import url_metrics from "../database/models/url_metrics";
import mongoose from "mongoose";
import geoip from 'geoip-lite';

export const getUrlByClipped_url_id = ({ res, clipped_url_id }) => {
    return url.findOne({ clipped_url_id }, (err, data) => {
        if (err) {
            return error(res, SERVER_ERROR, 'could not fetch url');
        } else {
            return data;
        }
    })
}

export const saveUrlMetrics = (req, urlShortenId) => {
    let ip = req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        null;
    var geo = geoip.lookup(ip);

    let { device } = req;
    let browser = req.headers["user-agent"];
    let language = req.headers["accept-language"];
    let country = (geo ? geo.country : "Unknown");
    let region = (geo ? geo.region : "Unknown");
    let referer = req.headers.referer || "Unknown";
    const device_type = getDeviceType(device);

    url_metrics.create({
        urlShortenId,
        browser,
        language,
        region,
        referer,
        country,
        device: device_type
    })
}

/** Formats the result from `express-device` package for storage in the DB
 * @private
 * @param  {Object} device
 */
const getDeviceType = (device) => {
    return (['tv', 'bot', 'car'].includes(device.type) ? 'other' : device.type);
};