import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthentorized" }, { status: 401 });
    }

    // create a 1 hour expiration time
    const expirtationTime = Math.floor(Date.now() / 1000) + 60 * 60;

    // create a 1 minute issued at time subtracting 60 seconds to ensure the dalayed from server time and client time will be fixed
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamServerClient.createToken(
      user.id,
      expirtationTime,
      issuedAt,
    );

    console.log("user chat token", token);

    return Response.json({ token });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
