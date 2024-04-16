import mongoose from "mongoose";

const { Schema, models } = mongoose;

const postSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    content: {
        type: String,
        required: false,
    },
    media: {
        type: String,
        required: false,
    },
    pins: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User",
        }],
        validate: {
            validator: function (pins) {

                const uniquePins = new Set(pins);

                return uniquePins.size === pins.length;
            },
            message: props => `Duplicate ObjectId found in 'pins' array.`,
        },
    },
}, { timestamps: true });

const Post = models.Post || mongoose.model("Post", postSchema);
export default Post;
