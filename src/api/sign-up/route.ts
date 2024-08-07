import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVarificationEmail } from "@/helpers/sendVarificationEmail";

export async function POST(request:Request) {
    
    await dbConnect()
    try {
        const {username,email,password}=await request.json()
        
    } catch (error) {
        console.error("Error registring user")
        return Response.json({success:false,message:"Error registring user"},{status:500})
    }
}