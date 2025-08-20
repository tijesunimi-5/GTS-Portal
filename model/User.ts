import mongoose, { Document, Schema, Model, ObjectId } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  uniqueID?: string;
  email?: string;
  password?: string;
  department?: string;
  role: 'student' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  uniqueID: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true, select: false },
  department: { type: String },
  role: { type: String, enum: ['student', 'admin'], required: true },
});

// Pre-save hook to hash password and standardize uniqueID casing
// UserSchema.pre<IUser>('save', async function (next) {
//   if (this.isModified('password') && this.password) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   // This is the crucial line: it ensures the uniqueID is always uppercase
//   if (this.isModified('uniqueID') && this.uniqueID) {
//     this.uniqueID = this.uniqueID.toUpperCase();
//   }
//   next();
// });

// Add this new pre-save hook
UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('uniqueID') && this.uniqueID) {
    this.uniqueID = this.uniqueID.toUpperCase();
  }
  // This is the new crucial line for email standardization.
  if (this.isModified('email') && this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password || '');
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;