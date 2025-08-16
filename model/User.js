import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    uniqueID: { type: String, unique: true, sparse: true }, // Only for students
    email: { type: String, unique: true, sparse: true }, // Only for admins
    password: { type: String, select: false }, // Will be hashed
    department: { type: String },
    role: { type: String, enum: ["student", "admin"], default: "student" },
  },
  {
    timestamps: true,
  }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 🔑 Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 📦 Export model
export default mongoose.models.User || mongoose.model("User", userSchema);
