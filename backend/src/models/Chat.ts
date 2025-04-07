import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChat extends Document {
  users: Types.ObjectId[]; // Using ObjectId for referencing User model
  isGroupChat?: boolean;
  chatName?: string;
  chatIcon?:string;
  lastMessage?: string;
  Admins?: Types.ObjectId[];
}

const chatSchema: Schema<IChat> = new Schema(
  { 
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    isGroupChat: { type: Boolean, default: false },
    chatName: { type: String },
    chatIcon : {type: String},
    lastMessage: { type: String },
    Admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
