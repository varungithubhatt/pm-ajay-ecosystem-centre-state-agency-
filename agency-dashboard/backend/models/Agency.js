import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { 
    type: String, 
    required: true, 
    match: /^[0-9]{10}$/  // allows only 10 digits
  },
  agencyType: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  bankAcc: { 
    type: String, 
    required: true, 
    match: /^[0-9]{10}$/ // most bank accounts 9–18 digits
  },
  password: { type: String, required: true },
});

export default mongoose.model("Agency", agencySchema);
