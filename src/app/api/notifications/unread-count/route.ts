import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationCountInfo } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthentorized" }, { status: 401 });
    }

    const unreadCount = await prisma.notification.count({
      where: {
        read: false,
        recipientId: user.id,
      },
    });

    const data: NotificationCountInfo = {
      unreadCount,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
