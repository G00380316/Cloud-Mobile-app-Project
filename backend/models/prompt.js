import mongoose from "mongoose";

const { Schema, models } = mongoose;

const promptSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    prompt: {
        type: String,
        required: true,
    }
},
    { timestamps: true }
);

const Prompt = models.Prompt || mongoose.model("prompt", promptSchema);

export default Prompt;