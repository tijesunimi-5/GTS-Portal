import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  department: string;
  uniqueID: string;
}

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  uniqueID: { type: String, required: true, unique: true },
});

const StudentModel: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default StudentModel;