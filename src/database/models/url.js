import mongoose from 'mongoose';
const {Schema} = mongoose;


const UrlSchema = new Schema({
    original_url: { type: String, required: true },
    clipped_url: { type: String, required: true },
    clipped_url_id: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    click_count: { type: Number, required: true, default: 0 },
    // expiry_date: { type: Date }
})

export default mongoose.model("url", UrlSchema);