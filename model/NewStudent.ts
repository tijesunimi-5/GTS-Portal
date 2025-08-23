// model/PendingStudent.ts
import mongoose from 'mongoose';

const PendingStudentSchema = new mongoose.Schema({
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
});

const PendingStudentModel = mongoose.models.PendingStudent || mongoose.model('PendingStudent', PendingStudentSchema);

export default PendingStudentModel;