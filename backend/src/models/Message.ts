import mongoose, { Schema, Types } from "mongoose";

interface IMessage {
  content: string;
  senderId: Types.ObjectId;
  chatId: Types.ObjectId;
}

const messageSchema: Schema<IMessage> = new Schema({
  content: { type: String, required: true },
  senderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  chatId: { type: Schema.Types.ObjectId, required: true, ref: "Chat" },
},{timestamps:true});

const Message = mongoose.model("Message", messageSchema);

export default Message;
