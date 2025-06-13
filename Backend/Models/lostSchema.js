import mongoose from "mongoose";

const lostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  productName: { type: String, required: true },
  brand: { type: String, required: true },
  color: { type: String, required: true },
  serialNumber: { type: String, default: "" },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["wallet", "phone", "key", "handbag", "laptop", "jewelry", "other"]
  },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["lost", "found"], 
    required: true 
  },
  status: {
    type: String,
    enum: ["pending", "claimed", "returned"],
    default: "pending"
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  images: [String]
}, { timestamps: true });



const Lost = mongoose.model("Lost", lostSchema);
export default Lost;