import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameSchema } from "@/schemas/signUpSchema";

const userNameQuerySchema = z.object({
  username: usernameSchema,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    // console.log("Received query parameters:", queryParams);
    const parseResult = userNameQuerySchema.safeParse(queryParams);
    // console.log("Parse result:", parseResult);
    if (!parseResult.success) {
      const usernameErrors = parseResult.error.format().username?._errors;
      console.log("Username validation errors:", usernameErrors);
      return Response.json(
        {
          success: false,
          errors: usernameErrors,
        },
        { status: 400 }
      );
    }

    const { username } = parseResult.data;
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username uniqueness",
      },
      { status: 500 }
    );
  }
}
