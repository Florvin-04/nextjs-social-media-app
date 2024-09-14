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
        <div className="relative mx-auto flex w-[min(100rem,100%)] flex-1 gap-2 px-3 py-3 sm:pl-0 md:pr-0 lg:pb-3">
          <Menubar
            displayProfile
            className="sticky top-[4.3rem] hidden h-fit w-fit -translate-y-[1rem] flex-col gap-1 rounded-lg px-2 py-2 sm:flex max-w-[15rem]"
          />
          {children}
        </div>
        <Menubar className="sticky bottom-0 mt-auto flex justify-evenly bg-card py-1 sm:hidden" />
      </div>
    </SessionProvider>
  );
};

export default layout;
