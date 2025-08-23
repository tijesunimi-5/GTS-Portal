// model/User.ts
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface for the User document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  uniqueID: string;
  department: string;
  password?: string;
  role: 'student' | 'admin';
  status: 'pending' | 'active';
  email?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  uniqueID: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
    select: true, // important so `.select('+password')` works
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  status: {
    type: String,
    enum: ['pending', 'active'],
    default: 'pending',
  },
  email: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
  },
});

// Pre-save hook to hash the password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add the comparePassword method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ Ensure schema methods don’t get lost during hot reload
const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);

export default UserModel;
