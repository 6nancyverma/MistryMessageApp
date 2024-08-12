import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVarificationEmail } from "@/helpers/sendVarificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVarifiedByUsename = await UserModel.findOne({
      username,
      isVarified: true,
    });

    if (existingUserVarifiedByUsename) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const varifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVarified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.varifyCode = varifyCode;
        existingUserByEmail.varifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save()
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours(), 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        varifyCode: varifyCode,
        varifyCodeExpiry: expiryDate,
        isVarified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVarificationEmail(
      email,
      username,
      varifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered succssfully, Please varify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registring user");
    return Response.json(
      { success: false, message: "Error registring user" },
      { status: 500 }
    );
  }
}
