import mongoose from "mongoose"



const contactSchemas = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
        required: false,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
      },
      phone: {
        type: String,
        required: false,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
      },
      favorite: {
        type: Boolean,
        required: false,
        default: false,
      },
}, {
    versionKey: false,
    timestamps: true
})

export default mongoose.model("Contact", contactSchemas)