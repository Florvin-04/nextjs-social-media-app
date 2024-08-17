import { validateRequest } from "@/auth";
import { CONFIG_APP } from "@/config";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

const replaceUrl = `/a/${CONFIG_APP.env.UPLOADTHING_APP_ID}/`;

const userValidateMiddleware = async () => {
  const { user } = await validateRequest();

  if (!user) throw new UploadThingError("Unathorized");

  return { user };
};

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(userValidateMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatar = metadata.user.avatarUrl;

      if (oldAvatar) {
        const key = oldAvatar.split(`${replaceUrl}`)[1];

        await new UTApi().deleteFiles(key);
      }

      const newAvatarUrl = file.url.replace("/f/", `${replaceUrl}`);

      await prisma.user.update({
        where: {
          id: metadata.user.id,
        },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });

      return { avatarUrl: newAvatarUrl };
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(userValidateMiddleware)
    .onUploadComplete(async ({ file }) => {
      const newFileUrl = file.url.replace("/f/", `${replaceUrl}`);
      const media = await prisma.media.create({
        data: {
          url: newFileUrl,
          type: file.type.includes("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
