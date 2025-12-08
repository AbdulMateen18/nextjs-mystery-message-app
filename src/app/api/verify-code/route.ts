import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { code, username } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    console.log("User's verifyCode:", user.verifyCodeExpiry);
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();
    console.log(code);
    console.log("isCodeValid:", isCodeValid, "isCodeExpired:", isCodeExpired);
    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Verification successful",
        },
        { status: 200 }
      );
    } else if (isCodeValid && isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired. Please sign up again.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying code:",
      },
      { status: 500 }
    );
  }
}
