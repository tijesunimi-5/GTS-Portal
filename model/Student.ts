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
}, {
  toJSON: {
    transform: function (doc, ret) {
      // Cast 'ret' to 'any' to allow adding and deleting properties without
      // TypeScript errors. This is a common pattern for Mongoose transforms.
      const transformedRet: any = ret;
      transformedRet.id = transformedRet._id.toString();
      delete transformedRet._id;
      delete transformedRet.__v;
    }
  }
});

const StudentModel: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('User', StudentSchema);

export default StudentModel;