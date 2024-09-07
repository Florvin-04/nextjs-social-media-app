import { validateRequest } from "@/auth";
import { replaceUploadThingUrl } from "@/lib/constants";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

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
        const key = oldAvatar.split(`${replaceUploadThingUrl}`)[1];

        await new UTApi().deleteFiles(key);
      }

      const newAvatarUrl = file.url.replace("/f/", `${replaceUploadThingUrl}`);

      await Promise.all([
        prisma.user.update({
          where: {
            id: metadata.user.id,
          },
          data: {
            avatarUrl: newAvatarUrl,
          },
        }),

        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: {
            avatarUrl: newAvatarUrl,
          },
        }),
      ]);

      return { avatarUrl: newAvatarUrl };
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(userValidateMiddleware)
    .onUploadComplete(async ({ file }) => {
      const newFileUrl = file.url.replace("/f/", `${replaceUploadThingUrl}`);
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
