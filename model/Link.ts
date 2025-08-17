// model/Link.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILink extends Document {
  title: string;
  date: string;
  url: string;
}

const LinkSchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  url: { type: String, required: true },
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

const LinkModel: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);

export default LinkModel;