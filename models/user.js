import mongoose from "mongoose";

const { Schema, models } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

const User = models.User || mongoose.model("Userdb", userSchema);
export default User;