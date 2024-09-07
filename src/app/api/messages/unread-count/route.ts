import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";
import { MessagesNotifInfo } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthentorized" }, { status: 401 });
    }

    const { total_unread_count } = await streamServerClient.getUnreadCount(
      user.id,
    );

    const data: MessagesNotifInfo = {
      unreadCount: total_unread_count,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
