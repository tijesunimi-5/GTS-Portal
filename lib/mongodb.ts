import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined in .env.local');
}

declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  } | undefined;
}

let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {};

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      console.log('MongoDB Connected');
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
