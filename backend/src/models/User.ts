import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  bio?: string;
  avatar?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    password: String,
    bio: String,
    avatar: String,
    phoneNumber: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User',userSchema)

export default User