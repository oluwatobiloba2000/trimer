import mongoose from 'mongoose';
const {Schema} = mongoose;


const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

export default mongoose.model("user", UserSchema);