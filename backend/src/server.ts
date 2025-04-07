import express, { Request, Response } from "express";
import { connectDb } from "./db";
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes'
import chatRouter from "./routes/chatRoutes"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from "http"
import { initializeSocket } from "./config/socket";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = initializeSocket(server);


//Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000' ,
  credentials:true,
}));

app.use(express.json());
app.use(cookieParser());

connectDb();

//Routes
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)

app.get("/", (req: Request, res: Response) => {
 res.send("Hello, TypeScript with Express!"); 
});

server.listen(PORT, () => {
  console.log(`⚡ Server is running on http://localhost:${PORT}`);
});

export { io };
