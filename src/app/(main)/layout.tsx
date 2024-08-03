import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import Menubar from "./Menubar";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-[100svh] flex-col">
        <Navbar />
        <div className="relative mx-auto flex w-[min(100rem,100%)] gap-4 px-3 py-3">
          <Menubar className="sticky top-[4.3rem] hidden h-fit w-fit flex-col gap-1 rounded-lg px-2 py-2 sm:flex" />
          {children}
        </div>
        <Menubar className="mt-auto flex justify-evenly py-1 sm:hidden sticky bottom-0" />
      </div>
    </SessionProvider>
  );
};

export default layout;
