"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";
import Link from "next/link";

export default function UserProfile() {
  const { user } = useSession();

  return (
    <Link href={`/users/${user.username}`}>
      <Button variant="ghost" className="w-full justify-start gap-2">
        <div className="flex-shrink-0">
          <UserAvatar size={33} className="" avatarUrl={user.avatarUrl!} />
        </div>
        <p className="hidden truncate lg:block" title={user.displayName}>
          {user.displayName}
        </p>
      </Button>
    </Link>
  );
}
