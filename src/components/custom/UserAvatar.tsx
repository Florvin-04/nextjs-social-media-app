import Image from "next/image";
import React from "react";

import avatarPlaceHolder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

type Props = {
  avatarUrl?: string;
  size?: number;
  className?: string;
};

const UserAvatar = ({ avatarUrl, className, size }: Props) => {
  return (
    <Image
      src={avatarUrl || avatarPlaceHolder}
      alt="Avatar Url"
      width={size || 48}
      height={size || 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
};

export default UserAvatar;
