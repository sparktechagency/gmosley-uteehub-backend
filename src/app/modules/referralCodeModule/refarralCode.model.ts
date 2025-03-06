import mongoose from "mongoose";

const refarralCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
})

const ReferralCode = mongoose.model('referralCode', refarralCodeSchema);
export default ReferralCode