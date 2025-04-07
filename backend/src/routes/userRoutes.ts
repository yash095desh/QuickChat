import express, { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library'

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required!");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User Already Exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashSalt = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashSalt });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );


    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: { _id: user._id, name: user.name, email: user.email, token:token},
    });
  } catch (error) {
    console.error("SignUp Error:", error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
});


router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log('user',user)

    // Check if user exists and has a password
    if (!user || !user.password) {
      throw new Error("User or password doesn't exist");
    }

    // Compare provided password with the stored password
    const hashPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashPassword);

    // If passwords don't match
    if (!isMatch) {
      throw new Error("Password doesn't match");
    }

    // Generate JWT token
    const token = await jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );


    // Send success response with token
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: { _id: user._id, name: user.name, email: user.email , token:token },
    });

  } catch (error) {
    // Log error for debugging purposes
    console.error("Error while logging in", error);

    // Send a generic error response
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
});

router.post("/google/auth", async(req: Request,res: Response) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload();
    if(!payload) throw new Error("Invalid token")

    const { name, email, picture } = payload;

    let user = await User.findOne({email});

    if(!user){
      user = new User({
        name,
        email,
        avatar:picture
      })
      await user.save()
    }

    const jwtToken = jwt.sign(
      { userId : user._id, email: user.email, avatar:picture},
      process.env.JWT_SECRET as string,
      {expiresIn:"7d"}
    )


    res.json({ success:true , token:jwtToken})

  } catch (error) {
    console.error('Google Auth Error:',error)
    res.status(401).json({success:false,message:"Authentication failed"})
  }
})

router.get("/getUser", async (req: Request, res: Response) => {
  try {
    const { text } = req.query;

    if (!text) {
      throw new Error("Search Text not provided");
    }

    const users = await User.find({ name: { $regex: text, $options: "i" } });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error in getting user:", error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

router.get("/",async(req: Request,res: Response)=>{
try {
  const {userId} = req.query;

  if(!userId){
    throw new Error("user Id not provided !")
  }

  const user = await User.findById(userId).select("-password");

  if(!user){
    throw new Error(" user not found")
  }


  res.status(200).json({success:true, user})

} catch (error) {
  console.log("error in getting userData:",error)
  res.status(500).json({success:false,message:(error as Error).message})
}
})

router.put("/edit/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;  
    const { name, avatar, phoneNumber, bio } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User doesn't exist")
    }

    
    user.set({
      name,
      phoneNumber,
      avatar,
      bio
    });
    await user.save(); 

    res.status(200).json({ success: true, message: "User updated!", user });
  } catch (error) {
    console.error("Error in editing user profile:", error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});



export default router;
