"use server";

import prisma from "@/lib/prisma";
import { loginSchema, LoginSchemaType } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";

export const handleLoginAction = async (
  credentials: LoginSchemaType,
): Promise<{ error: string }> => {
  try {
    const { password, username } = loginSchema.parse(credentials);

    const usernameExist = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!usernameExist || !usernameExist.passwordHash) {
      return {
        error: "Invalid username or password",
      };
    }

    const isValidPassword = await verify(usernameExist.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!isValidPassword) {
      return {
        error: "Invalid username or password",
      };
    }

    const sessionDuration = 24 * 60 * 60 * 1000; // sec

    const session = await lucia.createSession(usernameExist.id, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.attributes,
      maxAge: sessionDuration,
    });

    return redirect("/");
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) throw error;

    return {
      error: "Something went wrong",
    };
  }
};
