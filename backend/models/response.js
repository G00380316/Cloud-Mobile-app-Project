import mongoose from "mongoose";

const { Schema, models } = mongoose;

const responseSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    prompt: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
},
    { timestamps: true }
);

const Response = models.Response || mongoose.model("response", responseSchema);

export default Response;