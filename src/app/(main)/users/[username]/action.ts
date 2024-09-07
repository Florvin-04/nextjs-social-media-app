"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileScheme,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileScheme.parse(values);

  const { user } = await validateRequest();

  // console.log({ validatedValues });

  if (!user) throw new Error("Unauthorized");

  // ********************************

  //* 'Interactive Transcation'
  //* use this transcation to create for multiple await function, if one fails, the transaction will be rollbacked, this transaction will support not only prisma client but also others function.

  // ********************************

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedPrismaUser = await tx.user.update({
      where: {
        id: user.id,
      },
      data: validatedValues,
      select: getUserDataSelect(user.id),
    });

    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validatedValues.displayName,
      },
    });

    return updatedPrismaUser;
  });

  return updatedUser;
}
