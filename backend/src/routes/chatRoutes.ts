import express,{Request,Response} from 'express'
import Chat from '../models/Chat';
import Message from '../models/Message';
import { users } from '../config/socket';
import { io } from '../server';

const router = express.Router()


router.post("/send",async(req:Request,res:Response)=>{
    try {
        const { senderId, receiverId, content } = req.body;

        // Ensure all required fields are provided
        if (!senderId || !receiverId || !content) {
             throw new Error("Missing required fields")
        }

        // Find an existing chat where both users exist
        let chat = await Chat.findOne({ users: { $all: [senderId, receiverId] } });

        if(!chat){
            chat = await new Chat({ users: [senderId, receiverId] }).save(); // Save directly here
            chat = await Chat.findById(chat._id).populate("users");
        }

        // Create and save new message
        if (!chat) {
            throw new Error("Chat not found");
        }
        
        const message = new Message({ content, chatId: chat._id, senderId });
        await message.save();

        const populatedMessage = await Message.findById(message._id).populate("senderId"," name avatar");
        
        const receiverSocketId = users[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", populatedMessage);
        }

        await Chat.updateOne({ _id: chat._id }, { $set: { lastMessage: content } });


        res.status(200).json({success:true,message:populatedMessage,chat})

    } catch (error) {
        console.log("Error in sending message:",error)
        res.status(500).json({success:false,message:(error as Error).message})
    }
})

router.post("/group/send",async(req:Request,res:Response)=>{
    try {
        const {chatId, senderId, content} = req.body;

        if(!chatId || !senderId || !content){
            throw new Error("Missing required feilds");
        }

        const chat = await Chat.findById(chatId);

        if(!chat)throw new Error("Chat doesn't exists");

        const message = new Message({
            content,
            senderId,
            chatId
        })
        await message.save();

        const populatedMessage = await Message.findById(message._id).populate("senderId","name avatar");

        // Emit the message to all users in the group using the room
        let senderSocketId = users[senderId];
        if(senderSocketId){
            io.to(chatId).except(senderSocketId).emit("newMessage", populatedMessage);
        }

        await Chat.updateOne({ _id: chat._id }, { $set: { lastMessage: content } });
        
        res.status(200).json({success:true,message:populatedMessage,chat});
    } catch (error) {
        console.log("error while sending group message :",error)
        res.status(500).json({success:false,message:(error as Error).message})
    }
})

router.post("/createGroupChat",async(req:Request,res:Response)=>{
    try {
        const {chatName , users, chatIcon , admin } = req.body;

        if(!chatName || users.length < 3 || !admin){
            throw new Error(" required feilds are missing")
        }

        const chat = new Chat({
            chatName,
            users,
            Admins:[admin],
            isGroupChat: true,
            chatIcon
        })
        await chat.save()

        res.status(200).json({success:true,message:"Group Chat Created",chat})

    } catch (error) {
        console.log("error in creating group chat",error)
        res.status(500).json({success:false,message:(error as Error).message})
    }
})

router.get("/getAll",async(req:Request,res:Response)=>{
    try {
        const userId = req.query.userId as string;

        if(!userId){
            throw new Error("User Id not found");
        }

        // Find chats where the user is a participant
        const chats = await Chat.find({ users: userId })
        .populate("users", "name email bio avatar") 
        .sort({ updatedAt: -1 }); 

    res.status(200).json({ success: true, chats });

    } catch (error) {
        console.log("Error in getting chats",error)
        res.status(500).json({success:false,message:(error as Error).message})
    }
})

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, chatId } = req.body;

    if (!userId || !chatId) {
      throw new Error("userId or chatId not provided");
    }

    const chat = await Chat.findById(chatId).populate("users").lean();
        if (!chat) {
            throw new Error("Chat not found")
        }

    const messages = await Message.find({ chatId: chatId }).sort({ createdAt: 1 }).populate("senderId","name avatar");

    res.status(200).json({ success: true, chat, messages });
  } catch (error) {
    console.log("error in fetching chat : ", error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

router.get("/exists", async(req:Request, res: Response)=>{
    try {
        const {userId,receiverId} = req.query;

        if(!userId || !receiverId){
            throw new Error("required params are missing")
        }

        const chat = await Chat.findOne({ users: { $all: [userId, receiverId] } }).populate("users").lean();


        res.status(200).json({success:true, chatExists: !!chat , chat})

    } catch (error) {
        console.log("Error in checking chat exists:",error)
        res.status(500).json({success:false,message: (error as Error).message})
    }
})

export default router;