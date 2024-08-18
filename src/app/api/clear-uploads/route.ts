import { CONFIG_APP } from "@/config";
import { replaceUploadThingUrl } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${CONFIG_APP.env.CRON}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const filesChecker = () => {
    //     if(CONFIG_APP.env.NODE_ENV === "production") {
    //         return {

    //         }
    //     }
    // }

    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(CONFIG_APP.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        url: true,
        id: true,
      },
    });

    new UTApi().deleteFiles(
      unusedMedia.map(
        (media) => media.url.split(`${replaceUploadThingUrl}`)[1],
      ),
    );

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((media) => media.id),
        },
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
