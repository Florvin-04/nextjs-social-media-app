import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthentorized" }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        read: false,
        recipientId: user.id,
      },

      data: {
        read: true,
      },
    });

    return new Response();
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
