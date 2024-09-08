import { google, lucia } from "@/auth";
import KyInstance from "@/lib/ky";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { slugify } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const storedState = cookies().get("state")?.value;
  const storedCodeVerifier = cookies().get("code_verifier")?.value;

  console.log({ code, state, storedState, storedCodeVerifier });

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const token = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    console.log({ token });

    const googleUser = await KyInstance.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      },
    ).json<{ id: string; name: string; picture: string }>();

    console.log({ googleUser });

    const existingGoogleUser = await prisma.user.findUnique({
      where: {
        googleId: googleUser.id,
      },
    });

    if (existingGoogleUser) {
      const session = await lucia.createSession(existingGoogleUser.id, {});

      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10);

    const username = `${slugify(googleUser.name)}-${userId.slice(0, 4)}`;

    // ********************************

    //* 'Interactive Transcation'
    //* use this transcation to create for multiple await function, if one fails, the transaction will be rollbacked, this transaction will support not only prisma client but also others function.

    // ********************************

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: googleUser.name,
          googleId: googleUser.id,
          avatarUrl: googleUser.picture,
        },
      });

      await streamServerClient.upsertUser({
        id: userId,
        name: googleUser.name,
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

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}
