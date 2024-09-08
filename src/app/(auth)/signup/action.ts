"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { signUpSchema, SignUpSchemaType } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const handleSignUpAction = async (
  credentials: SignUpSchemaType,
): Promise<{ error: string }> => {
  try {
    const { email, password, username } = signUpSchema.parse(credentials);

    const userId = generateIdFromEntropySize(10);

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const isUsernameExist = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (isUsernameExist) {
      return {
        error: "Username already Exist",
      };
    }

    const isEmailExist = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (isEmailExist) {
      return {
        error: "Email already Exist",
      };
    }

    // ********************************

    //* 'Interactive Transcation'
    //* use this transcation to create for multiple await function, if one fails, the transaction will be rollbacked, this transaction will support not only prisma client but also others function.

    // ********************************

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });

      await streamServerClient.upsertUser({
        id: userId,
        name: username,
        username,
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");

    // return new Response(null, {
    //   status: 302,
    //   headers: {
    //     Location: "/",
    //   },
    // });
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return {
      error: "Something went wrong",
    };
  }
};
