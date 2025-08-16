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
});

const LinkModel: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);

export default LinkModel;