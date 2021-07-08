import mongoose from 'mongoose';
const {Schema} = mongoose;


const UrlMetricsSchema = new Schema({
    urlShortenId: { type: Schema.Types.ObjectId, ref: 'url', required: true },
    country: String,
    // city: String,
    device: String,
    browser: String,
    language: String,
    region: String,
    referer: String,
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("urlMetrics", UrlMetricsSchema);