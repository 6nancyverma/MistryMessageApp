import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VarificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVarificationEmail(email:string,username:string,varifyCode:string):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry Message | Varification code ',
            react: VerificationEmail({username,otp:varifyCode}),
          });
        return{success:true,message:"Varification email sent successfully"}
    } catch (emailError) {
     console.error("Error sending varification email",emailError);
     return{success:false,message:"Failed to send varification email"}
        
    }
}