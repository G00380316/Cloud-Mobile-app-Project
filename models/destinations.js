import mongoose from "mongoose";

const { Schema, models } = mongoose;

const desSchema = new Schema({
    image: {
        type: String,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Destination = models.Destination || mongoose.model("Destination", desSchema);
export default Destination;
