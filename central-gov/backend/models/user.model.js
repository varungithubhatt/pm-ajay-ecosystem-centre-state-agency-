import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["CENTRE", "STATE", "ADMIN"],
    required: true
  },
  stateUT: {
    type: String, 
    default: null 
    // for STATE officials: e.g., "Haryana"
    // for CENTRE: null
  },
  designation: {
    type: String // e.g., "Joint Secretary", "Officer"
  },
    token:{
        type:String,
        default:''
    },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// 🔹 Pre-save hook for password hashing
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // 🔹 Method to compare password
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

export default mongoose.model("User", userSchema);
