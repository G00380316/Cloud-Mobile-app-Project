import mongoose from "mongoose";

const { Schema, models } = mongoose;

const postSchema = new Schema({
    authname: {
        type: String,
        required: true,
    },
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
}, { timestamps: true });

const Post = models.Post || mongoose.model("Post", postSchema);
export default Post;
